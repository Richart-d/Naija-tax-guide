import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-center">
      <AlertCircle className="mb-4 h-20 w-20 text-muted-foreground/50" />
      <h1 className="font-display text-4xl font-bold tracking-tight text-foreground">404 - Page Not Found</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link href="/">
        <Button className="mt-8" size="lg">Return Home</Button>
      </Link>
    </div>
  );
}
