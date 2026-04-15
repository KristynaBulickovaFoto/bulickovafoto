"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  contactFormSchema,
  type ContactFormValues,
} from "@/lib/validations";
import { SHOOT_TYPES } from "@/lib/constants";
import { submitInquiry } from "@/actions/contact";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      preferred_contact: "email",
    },
  });

  async function onSubmit(data: ContactFormValues) {
    setIsSubmitting(true);
    try {
      const result = await submitInquiry(data);
      if (result.success) {
        toast.success("Poptávka odeslána! Ozvu se vám co nejdříve.");
        reset();
      } else {
        toast.error(result.error ?? "Něco se pokazilo. Zkuste to znovu.");
      }
    } catch {
      toast.error("Něco se pokazilo. Zkuste to znovu.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-2xl border border-border/50 bg-white p-6 shadow-sm">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <input type="text" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {/* Jmeno */}
        <div className="space-y-2">
          <Label htmlFor="name">Jméno *</Label>
          <Input id="name" placeholder="Vaše jméno" {...register("name")} />
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            placeholder="vas@email.cz"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Telefon */}
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+420..."
            {...register("phone")}
          />
        </div>

        {/* Typ foceni */}
        <div className="space-y-2">
          <Label>Typ focení *</Label>
          <Select onValueChange={(val) => setValue("shoot_type", val as ContactFormValues["shoot_type"])}>
            <SelectTrigger>
              <SelectValue placeholder="Vyberte typ..." />
            </SelectTrigger>
            <SelectContent>
              {SHOOT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.shoot_type && (
            <p className="text-xs text-destructive">
              {errors.shoot_type.message}
            </p>
          )}
        </div>

        {/* Datum */}
        <div className="space-y-2">
          <Label htmlFor="preferred_date">Preferovaný datum</Label>
          <Input
            id="preferred_date"
            type="date"
            {...register("preferred_date")}
          />
        </div>

        {/* Misto */}
        <div className="space-y-2">
          <Label htmlFor="location">Místo</Label>
          <Input
            id="location"
            placeholder="Město / místo konání"
            {...register("location")}
          />
        </div>

        {/* Casovy rozsah */}
        <div className="space-y-2">
          <Label htmlFor="duration">Časový rozsah</Label>
          <Input
            id="duration"
            placeholder="např. 8 hodin, celý den..."
            {...register("duration")}
          />
        </div>

        {/* Preferovany kontakt */}
        <div className="space-y-2">
          <Label>Preferovaný způsob kontaktu</Label>
          <Select
            defaultValue="email"
            onValueChange={(val) => setValue("preferred_contact", val as ContactFormValues["preferred_contact"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="email">E-mail</SelectItem>
              <SelectItem value="phone">Telefon</SelectItem>
              <SelectItem value="whatsapp">WhatsApp</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Zprava */}
      <div className="space-y-2">
        <Label htmlFor="message">Zpráva / vaše představa *</Label>
        <Textarea
          id="message"
          placeholder="Popište, co byste si představovali — styl focení, očekávání, cokoli dalšího..."
          rows={5}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-xs text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={isSubmitting} className="rounded-full shadow-md hover:shadow-lg">
        {isSubmitting ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Send className="mr-2 h-4 w-4" />
        )}
        Odeslat poptávku
      </Button>
    </form>
  );
}
