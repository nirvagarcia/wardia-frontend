"use client";

import { useState } from "react";
import { Copy, Eye, EyeOff, Pencil, Trash2, Check, RotateCcw } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { credentialsService } from "@/shared/services/credentials-service";
import type { ICredential } from "@/shared/types/finance";

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(text);
      setTimeout(() => setCopied(null), 2000);
    });
  }
  return { copied, copy };
}

function getBankGradient(bankName: string): string {
  const b = bankName.toLowerCase();
  if (b.includes("bcp") || b.includes("crédito del perú") || b.includes("credito del peru"))
    return "from-blue-600 via-blue-700 to-blue-800";
  if (b.includes("interbank")) return "from-emerald-600 via-emerald-700 to-green-700";
  if (b.includes("bbva")) return "from-blue-700 via-blue-800 to-indigo-900";
  if (b.includes("scotiabank")) return "from-red-600 via-red-700 to-red-800";
  if (b.includes("falabella")) return "from-green-600 via-green-700 to-emerald-800";
  if (b.includes("ripley")) return "from-purple-600 via-purple-700 to-violet-800";
  return "from-slate-600 via-slate-700 to-slate-800";
}

function NetworkBadge({ network }: { network?: ICredential["cardNetwork"] }) {
  if (!network) return null;
  const labels: Record<string, string> = { visa: "VISA", mastercard: "MC", amex: "AMEX", discover: "DISC" };
  return (
    <span className="text-white/80 font-bold text-xs tracking-wider">{labels[network] ?? network.toUpperCase()}</span>
  );
}

interface CredentialFlipCardProps {
  credential: ICredential;
  onEdit: (c: ICredential) => void;
  onDelete: (id: string) => void;
}

export function CredentialFlipCard({ credential, onEdit, onDelete }: CredentialFlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [fullData, setFullData] = useState<ICredential | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showCvv, setShowCvv] = useState(false);
  const { copy, copied } = useCopy();

  const gradient = getBankGradient(credential.bankName);
  const data = fullData ?? credential;

  async function handleFlip() {
    if (!flipped && !fullData) {
      setIsLoading(true);
      try {
        const full = await credentialsService.getCredentialById(credential.id);
        setFullData(full);
      } finally {
        setIsLoading(false);
      }
    }
    setFlipped((v) => !v);
  }

  const expiryLabel =
    data.expiryMonth && data.expiryYear
      ? `${String(data.expiryMonth).padStart(2, "0")}/${String(data.expiryYear).slice(-2)}`
      : "–";

  const accountLast4 = data.accountNumber
    ? data.accountNumber.length > 4
      ? `****${data.accountNumber.slice(-4)}`
      : data.accountNumber
    : null;

  return (
    <div className="relative w-full" style={{ perspective: "1000px" }}>
      <div
        className="relative w-full transition-transform duration-500"
        style={{
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          aspectRatio: "16/9",
          minHeight: "180px",
        }}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-2xl p-5 bg-gradient-to-br shadow-lg cursor-pointer select-none",
            gradient
          )}
          style={{ backfaceVisibility: "hidden" }}
          onClick={handleFlip}
        >
          {isLoading && (
            <div className="absolute inset-0 rounded-2xl bg-black/30 flex items-center justify-center">
              <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <div className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white font-bold text-sm truncate max-w-[160px]">
                  {credential.cardName || credential.bankName}
                </p>
                <p className="text-white/60 text-xs">{credential.bankName}</p>
              </div>
              <NetworkBadge network={credential.cardNetwork} />
            </div>

            <div>
              {credential.type === "debit" ? (
                <p className="text-white/80 font-mono text-sm tracking-widest">
                  {accountLast4 ?? "•••• ••••"}
                </p>
              ) : (
                <div>
                  <p className="text-white/60 text-xs mb-0.5">Límite</p>
                  <p className="text-white font-semibold text-sm">
                    {credential.creditLimitValue?.toLocaleString() ?? "–"} {credential.creditLimitCurrency ?? ""}
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-white/50 text-xs">Vence</p>
                <p className="text-white font-mono text-sm">{expiryLabel}</p>
              </div>
              <div className="text-white/50 text-xs flex items-center gap-1">
                <RotateCcw className="w-3 h-3" />
                Ver detalles
              </div>
            </div>
          </div>
        </div>

        <div
          className={cn(
            "absolute inset-0 rounded-2xl p-4 bg-gradient-to-br shadow-lg",
            gradient
          )}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="h-full flex flex-col gap-2 text-xs">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white font-semibold text-sm truncate">{data.cardName || data.bankName}</p>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); onEdit(data); }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Editar"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); onDelete(credential.id); }}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-red-500/60 text-white transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleFlip}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Voltear"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-x-4 gap-y-1.5 content-start">
              {data.cardholderName && (
                <DetailRow label="Titular" value={data.cardholderName} onCopy={copy} copied={copied} />
              )}
              {data.accountNumber && (
                <DetailRow label="N° Cuenta" value={data.accountNumber} onCopy={copy} copied={copied} mono />
              )}
              {data.cci && (
                <DetailRow label="CCI" value={data.cci} onCopy={copy} copied={copied} mono />
              )}
              {data.cvv && (
                <div className="flex items-start justify-between gap-1 min-w-0">
                  <div className="min-w-0">
                    <p className="text-white/50 text-[10px] leading-tight">CVV</p>
                    <p className="text-white text-xs font-mono leading-tight">
                      {showCvv ? data.cvv : "•••"}
                    </p>
                  </div>
                  <div className="flex items-center gap-0.5 mt-2 flex-shrink-0">
                    {showCvv && (
                      <button onClick={() => copy(data.cvv!)} className="p-0.5 rounded hover:bg-white/20 text-white/50 hover:text-white transition-colors">
                        {copied === data.cvv ? <Check className="w-2.5 h-2.5 text-green-300" /> : <Copy className="w-2.5 h-2.5" />}
                      </button>
                    )}
                    <button onClick={() => setShowCvv((v) => !v)} className="p-0.5 rounded hover:bg-white/20 text-white/50 hover:text-white transition-colors">
                      {showCvv ? <EyeOff className="w-2.5 h-2.5" /> : <Eye className="w-2.5 h-2.5" />}
                    </button>
                  </div>
                </div>
              )}
              {data.expiryMonth && data.expiryYear && (
                <DetailRow label="Vence" value={expiryLabel} onCopy={copy} copied={copied} mono />
              )}
              {data.creditLimitValue !== undefined && (
                <DetailRow label="Límite" value={`${data.creditLimitCurrency} ${data.creditLimitValue.toLocaleString()}`} onCopy={copy} copied={copied} />
              )}
              {data.cutoffDay !== undefined && (
                <DetailRow label="Día corte" value={String(data.cutoffDay)} onCopy={copy} copied={copied} />
              )}
              {data.accountType && (
                <DetailRow label="Tipo" value={data.accountType === "savings" ? "Ahorros" : "Corriente"} onCopy={copy} copied={copied} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({
  label, value, onCopy, copied, mono = false,
}: {
  label: string; value: string; onCopy: (v: string) => void; copied: string | null; mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-1 min-w-0">
      <div className="min-w-0">
        <p className="text-white/50 text-[10px] leading-tight">{label}</p>
        <p className={cn("text-white text-xs truncate leading-tight", mono && "font-mono")}>{value}</p>
      </div>
      <button
        onClick={() => onCopy(value)}
        className="p-0.5 rounded hover:bg-white/20 text-white/50 hover:text-white transition-colors flex-shrink-0 mt-2"
      >
        {copied === value ? <Check className="w-2.5 h-2.5 text-green-300" /> : <Copy className="w-2.5 h-2.5" />}
      </button>
    </div>
  );
}
