"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type FormEvent } from "react";
import type { Dictionary } from "@/content";
import type { NeedId } from "@/content/types";
import { site } from "@/content/site";
import { StaticStack } from "./StaticStack";

// Motion is fetched only once the visitor gets near the form.
const StackPreview = dynamic(() => import("./StackPreview"), { ssr: false, loading: () => null });

type Status = "idle" | "sending" | "success" | "error" | "fallback";
type FieldErrors = Partial<Record<"name" | "email" | "phone", string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^\+?[0-9][0-9\s-]{7,15}$/;

export function ContactForm({ contact }: { contact: Dictionary["contact"] }) {
  const { builder, form } = contact;
  const [selected, setSelected] = useState<NeedId[]>([]);
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const formRef = useRef<HTMLFormElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = formRef.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLive(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const preview = live ? (
    <StackPreview builder={builder} selected={selected} />
  ) : (
    <StaticStack builder={builder} selected={selected} />
  );

  const toggle = (id: NeedId) =>
    setSelected((list) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]));

  function validate(data: FormData): FieldErrors {
    const next: FieldErrors = {};
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    if (!name) next.name = form.required;
    if (!email) next.email = form.required;
    else if (!EMAIL.test(email)) next.email = form.invalidEmail;
    if (phone && !PHONE.test(phone)) next.phone = form.invalidPhone;
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const el = event.currentTarget;
    const data = new FormData(el);
    if (String(data.get("website") ?? "")) return; // honeypot

    const found = validate(data);
    setErrors(found);
    const first = (["name", "email", "phone"] as const).find((k) => found[k]);
    if (first) {
      el.querySelector<HTMLInputElement>(`[name="${first}"]`)?.focus();
      return;
    }

    const needs = builder.needs.filter((n) => selected.includes(n.id)).map((n) => n.label);
    const payload = {
      name: String(data.get("name")).trim(),
      company: String(data.get("company") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      email: String(data.get("email")).trim(),
      needs,
      message: String(data.get("message") ?? "").trim(),
      source: "rockstack-website",
    };

    if (!site.contactEndpoint) {
      // No backend wired yet: hand the visitor a ready email instead of losing the request.
      const body = [
        `${form.name}: ${payload.name}`,
        `${form.company}: ${payload.company}`,
        `${form.phone}: ${payload.phone}`,
        `${form.email}: ${payload.email}`,
        `${builder.legend} ${needs.join(", ")}`,
        "",
        payload.message,
      ].join("\n");
      setStatus("fallback");
      window.location.href = `mailto:${site.email ?? ""}?subject=${encodeURIComponent("פנייה מהאתר: RockStack")}&body=${encodeURIComponent(body)}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(site.contactEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setStatus("success");
      formRef.current?.reset();
      setSelected([]);
    } catch (err) {
      console.error("[contact] submit failed", err);
      setStatus("error");
    }
  }

  const fieldClass =
    "mt-2 block w-full rounded-[var(--radius-slab)] bg-basalt-raised px-4 py-3.5 text-ivory placeholder:text-stone/80 outline-offset-2 transition-[background-color] duration-150 hover:bg-[#262b32] focus-visible:outline-3 focus-visible:outline-amber aria-[invalid=true]:outline-2 aria-[invalid=true]:outline-amber";

  return (
    <>
      <div className="grid grid-cols-1 gap-x-8 gap-y-14 lg:grid-cols-12">
        <form ref={formRef} noValidate onSubmit={onSubmit} className="lg:col-span-7" aria-describedby="form-status">
          <fieldset>
            <legend className="text-statement font-bold">{builder.legend}</legend>
            <p className="mt-2 text-body text-stone">{builder.hint}</p>
            <div className="mt-6 flex flex-wrap gap-x-2 gap-y-3">
              {builder.needs.map((need) => (
                <label key={need.id} className="cursor-pointer">
                  <input
                    type="checkbox"
                    name="needs"
                    value={need.id}
                    checked={selected.includes(need.id)}
                    onChange={() => toggle(need.id)}
                    className="keycap-input sr-only"
                  />
                  <span className="keycap">
                    <span className="keycap-check" aria-hidden="true">
                      <svg viewBox="0 0 16 16" className="size-[1.05em]">
                        <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {need.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Stack preview sits between the choices and the fields on phones */}
          <div className="mt-10 lg:hidden">{preview}</div>

          <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
            <Field label={form.name} name="name" autoComplete="name" error={errors.name} required className={fieldClass} />
            <Field label={form.company} name="company" autoComplete="organization" className={fieldClass} />
            <Field
              label={form.phone}
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              dir="ltr"
              error={errors.phone}
              className={fieldClass}
            />
            <Field
              label={form.email}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              dir="ltr"
              spellCheck={false}
              error={errors.email}
              required
              className={fieldClass}
            />
            <div className="sm:col-span-2">
              <label htmlFor="f-message" className="text-small font-semibold text-ivory">
                {form.message}
              </label>
              <textarea
                id="f-message"
                name="message"
                rows={4}
                autoComplete="off"
                placeholder={form.messagePlaceholder}
                className={`${fieldClass} resize-y`}
              />
            </div>
            {/* Honeypot: hidden from people, filled by bots. taste-skill-ignore (off-screen, not a rule) */}
            <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
              <label htmlFor="f-website">Website</label>
              <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-6">
            <button type="submit" className="btn btn-primary min-w-40" disabled={status === "sending"}>
              {status === "sending" ? form.sending : form.submit}
            </button>
            <p id="form-status" role="status" aria-live="polite" className="text-body text-ivory">
              {status === "success" && form.success}
              {status === "error" && form.error}
              {status === "fallback" && form.notConfigured}
            </p>
          </div>
        </form>

        <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
          <div className="sticky top-28">{preview}</div>
        </div>
      </div>
    </>
  );
}

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  error?: string;
};

function Field({ label, name, error, required, className, ...rest }: FieldProps) {
  const id = `f-${name}`;
  const errorId = `${id}-error`;
  return (
    <div>
      <label htmlFor={id} className="text-small font-semibold text-ivory">
        {label}
        {required ? <span aria-hidden="true" className="text-amber"> *</span> : null}
      </label>
      <input
        id={id}
        name={name}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : undefined}
        className={className}
        {...rest}
      />
      {error ? (
        <p id={errorId} className="mt-2 text-small font-semibold text-amber">
          {error}
        </p>
      ) : null}
    </div>
  );
}
