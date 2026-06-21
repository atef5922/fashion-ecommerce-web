"use client";

import { FormEvent, useState } from "react";
import { CheckCircle2, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContactPage() {
  const [formState, setFormState] = useState<"idle" | "loading" | "success">("idle");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("loading");
    window.setTimeout(() => setFormState("success"), 450);
  }

  return (
    <div className="container grid gap-12 py-16 lg:grid-cols-[0.8fr_1fr] lg:py-24">
      <div>
        <p className="type-eyebrow text-luxury-burgundy">Client care</p>
        <h1 className="type-page-title mt-4">Contact</h1>
        <div className="mt-10 space-y-4 text-sm text-muted-foreground">
          <p className="flex items-center gap-3"><Phone className="size-4" /> +1 212 555 0198</p>
          <p className="flex items-center gap-3"><Mail className="size-4" /> studio@mugnee.com</p>
          <p className="flex items-center gap-3"><MapPin className="size-4" /> 283 N Glenwood Street, New York</p>
        </div>
      </div>
      <form
        className="grid gap-4 bg-card p-6 shadow-soft dark:border dark:border-luxury-dark-border dark:bg-luxury-dark-card md:p-10"
        onSubmit={handleSubmit}
      >
        <Input name="name" placeholder="Name" aria-label="Name" autoComplete="name" required />
        <Input name="email" placeholder="Email" aria-label="Email" type="email" autoComplete="email" required />
        <Input name="subject" placeholder="Subject" aria-label="Subject" required />
        <Textarea name="message" placeholder="Message" aria-label="Message" required />
        <Button type="submit" variant="dark" isLoading={formState === "loading"} loadingText="Sending">
          Send message
        </Button>
        {formState === "success" && (
          <p className="flex items-center gap-2 border border-luxury-olive/25 bg-luxury-olive/5 p-3 text-sm text-luxury-olive dark:border-luxury-gold/30 dark:bg-luxury-gold/10 dark:text-luxury-gold" role="status">
            <CheckCircle2 className="size-4" /> Your request is ready for client care.
          </p>
        )}
      </form>
    </div>
  );
}
