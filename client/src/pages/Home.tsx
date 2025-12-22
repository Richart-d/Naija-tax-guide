import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white pb-16 pt-24 lg:pb-32 lg:pt-40">
        <div className="absolute inset-0 z-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#105D3B 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
        
        <div className="container-padding relative z-10 mx-auto">
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div variants={item} className="mb-6 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              Updated for Finance Act 2024
            </motion.div>
            
            <motion.h1 variants={item} className="font-display text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
              Nigerian Taxes, <br />
              <span className="text-primary">Simplified.</span>
            </motion.h1>
            
            <motion.p variants={item} className="mt-6 text-lg leading-8 text-muted-foreground">
              Don't let tax jargon confuse you. Understand your obligations as a freelancer, business owner, or salary earner in less than 3 minutes.
            </motion.p>
            
            <motion.div variants={item} className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/classifier">
                <Button size="lg" className="h-14 w-full px-8 text-lg shadow-xl shadow-primary/20 sm:w-auto">
                  Check My Status <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/assessment">
                <Button variant="outline" size="lg" className="h-14 w-full px-8 text-lg sm:w-auto">
                  Am I Ready?
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-muted/30 py-24 sm:py-32">
        <div className="container-padding mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Why use this guide?</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Tax laws are complex. We break them down into plain English actionable steps.
            </p>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-none lg:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "No Jargon",
                description: "We explain everything in simple terms. No 'pursuant to section 4' complications."
              },
              {
                icon: Zap,
                title: "Instant Results",
                description: "Answer 3 questions and know exactly what taxes apply to you immediately."
              },
              {
                icon: CheckCircle2,
                title: "Actionable Steps",
                description: "Don't just learn what to pay, learn HOW to pay and where to go."
              },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5 }}
                className="card-hover flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-border"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary text-primary">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{feature.title}</h3>
                <p className="mt-4 flex-auto text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-primary py-16 sm:py-24 lg:py-32">
        <div className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0">
          <div className="aspect-[1155/678] w-[72.1875rem] bg-gradient-to-br from-[#ffeba1] to-[#105d3b] opacity-20" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
        </div>
        
        <div className="container-padding mx-auto text-center">
          <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Start getting your tax right today.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-foreground/80">
            Compliance is cheaper than penalties. Find out what you owe and get peace of mind.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/learn">
              <Button size="lg" variant="secondary" className="px-8 text-primary font-bold shadow-lg">
                Start Learning
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
