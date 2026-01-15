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

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Minimal backend route
  app.get(api.health.path, async (_req, res) => {
    res.json({ status: "ok" });
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
            model: "mistralai/mistral-7b-instruct:free", // Legacy free model
            messages: [
              {
                role: "system",
                content:
                  "You are a helpful and knowledgeable Nigerian Tax Assistant. specialized in Nigerian tax laws (PIT, VAT, CIT). Keep answers concise, friendly, and strictly related to Nigerian tax context. Do not answer questions unrelated to taxes or finance in Nigeria. Use Naira (₦) for currency.",
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
