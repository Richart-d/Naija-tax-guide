import { Link, useLocation } from "wouter";
import { useState } from "react";
import { 
  Menu, X, Calculator, BookOpen, 
  CheckSquare, Activity, Home 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/classifier", label: "Check Status", icon: Calculator },
    { href: "/assessment", label: "Readiness", icon: Activity },
    { href: "/checklist", label: "Checklist", icon: CheckSquare },
    { href: "/learn", label: "Learn", icon: BookOpen },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-padding flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          {/* Logo Icon */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="font-display font-bold text-lg">N</span>
          </div>
          <span className="hidden font-display font-bold sm:inline-block text-xl tracking-tight">
            NaijaTaxGuide
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={cn(
                  "group flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-primary/20",
                  isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                )}
              >
                <Icon className={cn("h-4 w-4 transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
                {link.label}
              </Link>
            );
          })}
        </div>

        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[350px]">
              <div className="flex flex-col gap-6 py-4">
                <div className="flex items-center gap-2 px-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="font-display font-bold text-lg">N</span>
                  </div>
                  <span className="font-display font-bold text-xl">NaijaTaxGuide</span>
                </div>
                <div className="flex flex-col gap-1">
                  {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = location === link.href;
                    return (
                      <Link 
                        key={link.href} 
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary hover:text-secondary-foreground",
                          isActive ? "bg-secondary text-secondary-foreground" : "text-muted-foreground"
                        )}
                      >
                        <Icon className={cn("h-5 w-5", isActive ? "text-primary" : "text-muted-foreground")} />
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
