"use client";

import React, { useState, useEffect } from "react";
import { X, Building2, CreditCard, Wallet, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import {
  bankCredentialModalSchema,
  debitCardModalSchema,
  creditCardModalSchema,
  type BankCredentialModalData,
  type DebitCardModalData,
  type CreditCardModalData,
} from "@/shared/validation/schemas";
import type { ICredential, CredentialType } from "@/shared/types/finance";

type CredentialPayload = Omit<ICredential, "id" | "lastUpdated">;

interface AddCredentialsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CredentialPayload) => Promise<void> | void;
  onUpdate?: (id: string, data: Partial<CredentialPayload>) => Promise<void> | void;
  editingCredential?: ICredential | null;
}

const MONTHS = ["01","02","03","04","05","06","07","08","09","10","11","12"] as const;
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 15 }, (_, i) => CURRENT_YEAR + i);

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-red-500 text-xs mt-1">{msg}</p>;
}

function FormField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="text-sm font-medium mb-1 block">{label}</Label>
      {children}
      <FieldError msg={error} />
    </div>
  );
}

function PasswordInput({
  value, onChange, placeholder = "••••••••", error,
}: { value: string; onChange: (v: string) => void; placeholder?: string; error?: string; }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="relative">
        <Input type={show ? "text" : "password"} value={value} onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder} autoComplete="new-password"
          className={cn("font-mono pr-10", error && "border-red-500 focus-visible:ring-red-500")} />
        <button type="button" onClick={() => setShow((v) => !v)} tabIndex={-1}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
      <FieldError msg={error} />
    </div>
  );
}

const TYPES: { type: CredentialType; label: string; sublabel: string; Icon: React.ElementType }[] = [
  { type: "bank",   label: "Credenciales Bancarias", sublabel: "Usuario y contrasena del banco en linea", Icon: Building2 },
  { type: "debit",  label: "Tarjeta de Debito",      sublabel: "Numero de cuenta, CCI, vencimiento y CVV", Icon: Wallet },
  { type: "credit", label: "Tarjeta de Credito",     sublabel: "Limite, corte, numero de cuenta y CVV",    Icon: CreditCard },
];

function TypeSelector({ onSelect }: { onSelect: (t: CredentialType) => void }) {
  return (
    <div className="p-6 space-y-3">
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">Selecciona el tipo de credencial:</p>
      {TYPES.map(({ type, label, sublabel, Icon }) => (
        <button key={type} type="button" onClick={() => onSelect(type)}
          className="w-full flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-700 hover:border-cyan-500 dark:hover:border-cyan-400 hover:bg-cyan-50 dark:hover:bg-cyan-950/30 transition-all text-left group">
          <span className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-900/50 flex items-center justify-center transition-colors flex-shrink-0">
            <Icon className="w-5 h-5 text-zinc-600 dark:text-zinc-400 group-hover:text-cyan-600 dark:group-hover:text-cyan-400" />
          </span>
          <div>
            <p className="font-medium text-zinc-900 dark:text-white text-sm">{label}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{sublabel}</p>
          </div>
        </button>
      ))}
    </div>
  );
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
  return (
    <button type="submit" disabled={isSubmitting}
      className="w-full h-10 bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white font-semibold rounded-lg transition-colors text-sm mt-2">
      {isSubmitting ? "Guardando..." : "Guardar"}
    </button>
  );
}

function BankForm({ initial, onSubmit, isSubmitting }: {
  initial?: Partial<BankCredentialModalData>; onSubmit: (d: BankCredentialModalData) => void; isSubmitting: boolean;
}) {
  const [form, setForm] = useState<BankCredentialModalData>({
    bankName: initial?.bankName ?? "", credentialName: initial?.credentialName ?? "",
    description: initial?.description ?? "", username: initial?.username ?? "", password: initial?.password ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  function set(field: keyof BankCredentialModalData, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => { const e = { ...p }; delete e[field]; return e; });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const r = bankCredentialModalSchema.safeParse(form);
    if (!r.success) { const errs: Record<string, string> = {}; r.error.issues.forEach((i) => { if (!errs[String(i.path[0])]) errs[String(i.path[0])] = i.message; }); setErrors(errs); return; }
    onSubmit(r.data);
  }
  return (
    <form id="credential-form" onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Banco *" error={errors['bankName']}><Input value={form.bankName} onChange={(e) => set("bankName", e.target.value)} placeholder="BBVA, BCP..." className={cn(errors['bankName'] && "border-red-500")} /></FormField>
        <FormField label="Nombre de credencial" error={errors['credentialName']}><Input value={form.credentialName ?? ""} onChange={(e) => set("credentialName", e.target.value)} placeholder="Cuenta principal" /></FormField>
      </div>
      <FormField label="Descripcion" error={errors['description']}><Input value={form.description ?? ""} onChange={(e) => set("description", e.target.value)} placeholder="Opcional" /></FormField>
      <FormField label="Usuario *" error={errors['username']}><Input value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="usuario@banco.com" className={cn("font-mono", errors['username'] && "border-red-500")} autoComplete="off" /></FormField>
      <FormField label="Contrasena *" error={errors['password']}><PasswordInput value={form.password} onChange={(v) => set("password", v)} error={errors['password']} /></FormField>
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}

function DebitForm({ initial, onSubmit, isSubmitting }: {
  initial?: Partial<DebitCardModalData>; onSubmit: (d: DebitCardModalData) => void; isSubmitting: boolean;
}) {
  const [form, setForm] = useState<DebitCardModalData>({
    bankName: initial?.bankName ?? "", cardName: initial?.cardName ?? "",
    accountType: initial?.accountType ?? "savings", cardNetwork: initial?.cardNetwork ?? "visa",
    accountNumber: initial?.accountNumber ?? "", cci: initial?.cci ?? "",
    expiryMonth: initial?.expiryMonth ?? 1, expiryYear: initial?.expiryYear ?? CURRENT_YEAR, cvv: initial?.cvv ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  function set<K extends keyof DebitCardModalData>(field: K, value: DebitCardModalData[K]) {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => { const e = { ...p }; delete e[field]; return e; });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const r = debitCardModalSchema.safeParse(form);
    if (!r.success) { const errs: Record<string, string> = {}; r.error.issues.forEach((i) => { if (!errs[String(i.path[0])]) errs[String(i.path[0])] = i.message; }); setErrors(errs); return; }
    onSubmit(r.data);
  }
  return (
    <form id="credential-form" onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Banco *" error={errors['bankName']}><Input value={form.bankName} onChange={(e) => set("bankName", e.target.value)} placeholder="BBVA, BCP..." className={cn(errors['bankName'] && "border-red-500")} /></FormField>
        <FormField label="Nombre de tarjeta *" error={errors['cardName']}><Input value={form.cardName} onChange={(e) => set("cardName", e.target.value)} placeholder="Debito BBVA" className={cn(errors['cardName'] && "border-red-500")} /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Tipo de cuenta *" error={errors['accountType']}>
          <Select value={form.accountType} onValueChange={(v) => set("accountType", v as DebitCardModalData["accountType"])}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="savings">Ahorros</SelectItem>
              <SelectItem value="checking">Corriente</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Red de tarjeta *" error={errors['cardNetwork']}>
          <Select value={form.cardNetwork} onValueChange={(v) => set("cardNetwork", v as DebitCardModalData["cardNetwork"])}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="mastercard">Mastercard</SelectItem>
              <SelectItem value="amex">American Express</SelectItem>
              <SelectItem value="discover">Discover</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>
      <FormField label="Numero de cuenta *" error={errors['accountNumber']}><Input value={form.accountNumber} onChange={(e) => set("accountNumber", e.target.value)} placeholder="12345678901" className={cn("font-mono", errors['accountNumber'] && "border-red-500")} /></FormField>
      <FormField label="CCI"><Input value={form.cci ?? ""} onChange={(e) => set("cci", e.target.value)} placeholder="00212345678901234567" className="font-mono" /></FormField>
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Mes venc. *" error={errors['expiryMonth']}>
          <Select value={String(form.expiryMonth)} onValueChange={(v) => set("expiryMonth", Number(v))}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => <SelectItem key={m} value={String(Number(m))}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Ano venc. *" error={errors['expiryYear']}>
          <Select value={String(form.expiryYear)} onValueChange={(v) => set("expiryYear", Number(v))}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="CVV *" error={errors['cvv']}><PasswordInput value={form.cvv} onChange={(v) => set("cvv", v)} placeholder="***" error={errors['cvv']} /></FormField>
      </div>
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}

function CreditForm({ initial, onSubmit, isSubmitting }: {
  initial?: Partial<CreditCardModalData>; onSubmit: (d: CreditCardModalData) => void; isSubmitting: boolean;
}) {
  const [form, setForm] = useState<CreditCardModalData>({
    bankName: initial?.bankName ?? "", cardName: initial?.cardName ?? "",
    cardholderName: initial?.cardholderName ?? "", cardNetwork: initial?.cardNetwork ?? "visa",
    creditLimitValue: initial?.creditLimitValue ?? 0, creditLimitCurrency: initial?.creditLimitCurrency ?? "PEN",
    cutoffDay: initial?.cutoffDay ?? 15, accountNumber: initial?.accountNumber ?? "", cci: initial?.cci ?? "",
    expiryMonth: initial?.expiryMonth ?? 1, expiryYear: initial?.expiryYear ?? CURRENT_YEAR, cvv: initial?.cvv ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  function set<K extends keyof CreditCardModalData>(field: K, value: CreditCardModalData[K]) {
    setForm((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => { const e = { ...p }; delete e[field]; return e; });
  }
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const r = creditCardModalSchema.safeParse(form);
    if (!r.success) { const errs: Record<string, string> = {}; r.error.issues.forEach((i) => { if (!errs[String(i.path[0])]) errs[String(i.path[0])] = i.message; }); setErrors(errs); return; }
    onSubmit(r.data);
  }
  return (
    <form id="credential-form" onSubmit={handleSubmit} className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Banco *" error={errors['bankName']}><Input value={form.bankName} onChange={(e) => set("bankName", e.target.value)} placeholder="BBVA, Falabella..." className={cn(errors['bankName'] && "border-red-500")} /></FormField>
        <FormField label="Nombre de tarjeta *" error={errors['cardName']}><Input value={form.cardName} onChange={(e) => set("cardName", e.target.value)} placeholder="Visa Gold BBVA" className={cn(errors['cardName'] && "border-red-500")} /></FormField>
      </div>
      <FormField label="Titular *" error={errors['cardholderName']}><Input value={form.cardholderName} onChange={(e) => set("cardholderName", e.target.value)} placeholder="JUAN PEREZ LOPEZ" className={cn("font-mono uppercase", errors['cardholderName'] && "border-red-500")} /></FormField>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Red de tarjeta *" error={errors['cardNetwork']}>
          <Select value={form.cardNetwork} onValueChange={(v) => set("cardNetwork", v as CreditCardModalData["cardNetwork"])}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="visa">Visa</SelectItem>
              <SelectItem value="mastercard">Mastercard</SelectItem>
              <SelectItem value="amex">American Express</SelectItem>
              <SelectItem value="discover">Discover</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Dia de corte *" error={errors['cutoffDay']}><Input type="number" min={1} max={31} value={form.cutoffDay} onChange={(e) => set("cutoffDay", Number(e.target.value))} className={cn(errors['cutoffDay'] && "border-red-500")} /></FormField>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField label="Limite de credito *" error={errors['creditLimitValue']}><Input type="number" min={0} step="0.01" value={form.creditLimitValue} onChange={(e) => set("creditLimitValue", Number(e.target.value))} className={cn("font-mono", errors['creditLimitValue'] && "border-red-500")} /></FormField>
        <FormField label="Moneda *" error={errors['creditLimitCurrency']}>
          <Select value={form.creditLimitCurrency} onValueChange={(v) => set("creditLimitCurrency", v as CreditCardModalData["creditLimitCurrency"])}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="PEN">PEN - Sol</SelectItem>
              <SelectItem value="USD">USD - Dólar</SelectItem>
              <SelectItem value="EUR">EUR - Euro</SelectItem>
            </SelectContent>
          </Select>
        </FormField>
      </div>
      <FormField label="Numero de cuenta"><Input value={form.accountNumber ?? ""} onChange={(e) => set("accountNumber", e.target.value)} placeholder="Opcional" className="font-mono" /></FormField>
      <FormField label="CCI"><Input value={form.cci ?? ""} onChange={(e) => set("cci", e.target.value)} placeholder="Opcional" className="font-mono" /></FormField>
      <div className="grid grid-cols-3 gap-4">
        <FormField label="Mes venc. *" error={errors['expiryMonth']}>
          <Select value={String(form.expiryMonth)} onValueChange={(v) => set("expiryMonth", Number(v))}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MONTHS.map((m) => <SelectItem key={m} value={String(Number(m))}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="Ano venc. *" error={errors['expiryYear']}>
          <Select value={String(form.expiryYear)} onValueChange={(v) => set("expiryYear", Number(v))}>
            <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              {YEARS.map((y) => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label="CVV *" error={errors['cvv']}><PasswordInput value={form.cvv} onChange={(v) => set("cvv", v)} placeholder="***" error={errors['cvv']} /></FormField>
      </div>
      <SubmitButton isSubmitting={isSubmitting} />
    </form>
  );
}

type Step = "select" | CredentialType;
const TYPE_LABELS: Record<CredentialType, string> = { bank: "Credenciales Bancarias", debit: "Tarjeta de Debito", credit: "Tarjeta de Credito" };

export function AddCredentialsModal({ isOpen, onClose, onSave, onUpdate, editingCredential }: AddCredentialsModalProps): React.JSX.Element | null {
  const [step, setStep] = useState<Step>(editingCredential ? editingCredential.type : "select");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) setStep(editingCredential ? editingCredential.type : "select");
  }, [isOpen, editingCredential]);

  if (!isOpen) return null;

  const isEditing = !!editingCredential;
  const title = isEditing ? `Editar ${TYPE_LABELS[editingCredential.type]}` : step === "select" ? "Agregar Credencial" : `Nueva ${TYPE_LABELS[step as CredentialType]}`;

  async function handleBankSubmit(data: BankCredentialModalData) {
    const payload: CredentialPayload = { type: "bank", bankName: data.bankName, credentialName: data.credentialName || undefined, description: data.description || undefined, username: data.username, password: data.password };
    setIsSubmitting(true);
    try { if (isEditing && onUpdate) await onUpdate(editingCredential.id, payload); else await onSave(payload); onClose(); } finally { setIsSubmitting(false); }
  }
  async function handleDebitSubmit(data: DebitCardModalData) {
    const payload: CredentialPayload = { type: "debit", bankName: data.bankName, cardName: data.cardName, accountType: data.accountType, cardNetwork: data.cardNetwork, accountNumber: data.accountNumber, cci: data.cci || undefined, expiryMonth: data.expiryMonth, expiryYear: data.expiryYear, cvv: data.cvv };
    setIsSubmitting(true);
    try { if (isEditing && onUpdate) await onUpdate(editingCredential.id, payload); else await onSave(payload); onClose(); } finally { setIsSubmitting(false); }
  }
  async function handleCreditSubmit(data: CreditCardModalData) {
    const payload: CredentialPayload = { type: "credit", bankName: data.bankName, cardName: data.cardName, cardholderName: data.cardholderName, cardNetwork: data.cardNetwork, creditLimitValue: data.creditLimitValue, creditLimitCurrency: data.creditLimitCurrency, cutoffDay: data.cutoffDay, accountNumber: data.accountNumber || undefined, cci: data.cci || undefined, expiryMonth: data.expiryMonth, expiryYear: data.expiryYear, cvv: data.cvv };
    setIsSubmitting(true);
    try { if (isEditing && onUpdate) await onUpdate(editingCredential.id, payload); else await onSave(payload); onClose(); } finally { setIsSubmitting(false); }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-3 sm:p-4" onClick={onClose}>
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-lg max-h-[92vh] flex flex-col animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <div className="flex-shrink-0 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 flex items-center gap-3">
          {step !== "select" && !isEditing && (
            <button type="button" onClick={() => setStep("select")} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
              <ChevronLeft className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
            </button>
          )}
          <h2 className="flex-1 text-lg font-bold text-zinc-900 dark:text-white">{title}</h2>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors">
            <X className="w-5 h-5 text-zinc-600 dark:text-zinc-400" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {step === "select" && <TypeSelector onSelect={(t) => setStep(t)} />}
          {step === "bank" && <BankForm initial={isEditing ? editingCredential : undefined} onSubmit={handleBankSubmit} isSubmitting={isSubmitting} />}
          {step === "debit" && <DebitForm initial={isEditing ? (editingCredential as Partial<DebitCardModalData>) : undefined} onSubmit={handleDebitSubmit} isSubmitting={isSubmitting} />}
          {step === "credit" && <CreditForm initial={isEditing ? (editingCredential as Partial<CreditCardModalData>) : undefined} onSubmit={handleCreditSubmit} isSubmitting={isSubmitting} />}
        </div>
      </div>
    </div>
  );
}
