import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

import rateLimit from "express-rate-limit";

// Rate limiter for chat endpoint: 10 requests per 15 minutes
const chatLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10, // Limit each IP to 10 requests per windowMs
  message: { message: "Too many requests from this IP, please try again after 15 minutes" },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});


// Import for Python child process
import { spawn } from "child_process";
import path from "path";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Minimal backend route
  app.get(api.health.path, async (_req, res) => {
    res.json({ status: "ok" });
  });

  // NEW: Tax Calculator Endpoint (Python Integration)
  app.post("/api/calculate-paye", async (req, res) => {
    try {
      const inputData = req.body;
      
      // Path to Python script (Resolved relative to project root)
      const scriptPath = path.resolve(process.cwd(), "server", "python", "calculate_paye.py");
      
      console.log(`Executing Python script: ${scriptPath}`);

      const pythonProcess = spawn("python3", [scriptPath]);
      
      let resultData = "";
      let errorData = "";

      // Send input data to Python via stdin
      pythonProcess.stdin.write(JSON.stringify(inputData));
      pythonProcess.stdin.end();

      // Capture stdout
      pythonProcess.stdout.on("data", (data) => {
        resultData += data.toString();
      });

      // Capture stderr
      pythonProcess.stderr.on("data", (data) => {
        errorData += data.toString();
      });

      // Handle process close
      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error(`Python script exited with code ${code}`);
          console.error(`Python Error: ${errorData}`);
          
          // Fallback message if script fails
          return res.status(500).json({ 
            success: false, 
            message: "Tax calculation service failed",
            details: errorData || "Unknown error in Python script"
          });
        }

        try {
            // Check if resultData is empty
            if (!resultData) {
                 throw new Error("No data returned from Python script");
            }

            const parsedResult = JSON.parse(resultData);
            res.json(parsedResult);
        } catch (e) {
            console.error("Failed to parse Python output:", resultData);
             res.status(500).json({ 
                success: false, 
                message: "Invalid response from calculation engine",
                raw: resultData
            });
        }
      });

    } catch (error) {
      console.error("Endpoint error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  app.post("/api/chat", chatLimiter, async (req, res) => {
    try {
      const { message } = req.body;

      if (!message) {
        res.status(400).json({ message: "Message is required" });
        return;
      }

      const apiKey = process.env.OPENROUTER_API_KEY;
      if (!apiKey) {
        res
          .status(500)
          .json({ message: "Server configuration error: Missing API Key" });
        return;
      }

      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://naijatax.app", // Optional: strictly for OpenRouter analytics
            "X-Title": "Naija Tax Bot", // Optional: strictly for OpenRouter analytics
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3.1-8b-instruct",
            messages: [
              {
                role: "system",
                content:
                  `You are a helpful **Nigerian Tax Guide**. You are NOT a licensed tax consultant or financial advisor. 
                  
                  **DISCLAIMER**: Always start or end complex advice with: *"I am an AI guide, not a tax professional. For complex financial decisions, please consult a certified tax practitioner."*

                  **Role**:
                  - Your goal is to guide the user through the **Nigeria Tax Act 2025** and other specific tax laws.
                  - Simplify concepts. Do not use overly formal "consultant" language.
                  - Be friendly but precise.

                  CRITICAL - USE THESE NEW TAX RATES (Effective 2025/2026):
                  
                  **1. New Personal Income Tax (PIT) Bands:**
                  - First ₦800,000: **0% (Tax Exempt)**
                  - Next ₦2,200,000: **15%**
                  - Next ₦9,000,000: **18%**
                  - Next ₦13,000,000: **21%**
                  - Next ₦25,000,000: **23%**
                  - Above ₦50,000,000: **25%**
                  
                  **2. Reliefs:**
                  - **Consolidated Relief Allowance (CRA)** is **ABOLISHED**. Do NOT mention it as active.
                  - Use **Rent Relief**: Deduction of 20% of annual rent paid, capped at ₦500,000.
                  
                  **3. VAT:**
                  - Standard Rate: **7.5%**
                  - Food, education, and healthcare are Zero-rated.

                  **Directives:**
                  - **Format**: Use Markdown. Use **Bold** for rates and key terms. Use Bullet points.
                  - **Conciseness**: Give direct answers. Do not ramble.
                  - **Calculations**: If asked to calculate tax, use the bands above strictly.
                  - **Context**: Reject inquiries about 2011 laws unless specifically asked for historical comparison.`,
              },
              {
                role: "user",
                content: message,
              },
            ],
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("OpenRouter API Error:", error);
        res
          .status(502)
          .json({ message: "Failed to get response from AI provider", error: error });
        return;
      }

      const data = await response.json();
      const aiMessage =
        data.choices?.[0]?.message?.content ||
        "I couldn't generate a response. Please try again.";

      res.json({ message: aiMessage });
    } catch (error) {
      console.error("Chat endpoint error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return httpServer;
}
