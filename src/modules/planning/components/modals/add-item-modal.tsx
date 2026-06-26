"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import NextImage from "next/image";
import { X, Plus, Trash2, Wand2, Upload, ImageOff } from "lucide-react";
import { cn } from "@/shared/utils/cn";
import { planningService } from "@/shared/services/planning-service";
import { uploadPlanningImage } from "@/shared/hooks/use-planning-query";
import type { IPlanningItem, ItemPriority, PlanningCurrency } from "@/shared/types/planning";

export interface ItemFormPayload {
  title: string;
  description?: string;
  imageUrl?: string | null;
  priceValue?: number | null;
  priceCurrency?: string;
  quantity?: number;
  priority?: string;
  status?: string;
  tags?: string[];
  notes?: string;
  links?: { label?: string; url: string }[];
}

interface AddItemModalProps {
  isOpen: boolean;
  editingItem?: IPlanningItem;
  onClose: () => void;
  onSave: (data: ItemFormPayload) => Promise<void>;
}

const CURRENCIES: PlanningCurrency[] = ["PEN", "USD", "EUR"];
const PRIORITIES: { value: ItemPriority; label: string }[] = [
  { value: "low", label: "Baja" },
  { value: "medium", label: "Media" },
  { value: "high", label: "Alta" },
];

export function AddItemModal({ isOpen, editingItem, onClose, onSave }: AddItemModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [ogDetected, setOgDetected] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [priceValue, setPriceValue] = useState("");
  const [priceCurrency, setPriceCurrency] = useState<PlanningCurrency>("PEN");
  const [quantity, setQuantity] = useState(1);
  const [priority, setPriority] = useState<ItemPriority>("medium");
  const [status, setStatus] = useState<string>("pending");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [notes, setNotes] = useState("");
  const [links, setLinks] = useState<{ label: string; url: string }[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ogDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (editingItem) {
      setTitle(editingItem.title);
      setDescription(editingItem.description ?? "");
      setImageUrl(editingItem.imageUrl ?? null);
      setPriceValue(editingItem.priceValue != null ? String(editingItem.priceValue) : "");
      setPriceCurrency(editingItem.priceCurrency as PlanningCurrency);
      setQuantity(editingItem.quantity ?? 1);
      setPriority(editingItem.priority as ItemPriority);
      setStatus(editingItem.status ?? "pending");
      setTags(editingItem.tags ?? []);
      setNotes(editingItem.notes ?? "");
      setLinks(editingItem.links?.map((l) => ({ label: l.label ?? "", url: l.url })) ?? []);
    } else {
      setTitle(""); setDescription(""); setImageUrl(null); setOgDetected(false);
      setPriceValue(""); setPriceCurrency("PEN"); setQuantity(1); setPriority("medium");
      setStatus("pending"); setTags([]); setTagInput(""); setNotes(""); setLinks([]);
    }
  }, [editingItem, isOpen]);

  const handleLinkUrlChange = useCallback((idx: number, url: string) => {
    setLinks((prev) => prev.map((l, i) => i === idx ? { ...l, url } : l));
    if (!imageUrl && url.startsWith("http")) {
      if (ogDebounceRef.current) clearTimeout(ogDebounceRef.current);
      ogDebounceRef.current = setTimeout(async () => {
        setImageLoading(true);
        try {
          const fetched = await planningService.fetchOgImage(url);
          if (fetched) { setImageUrl(fetched); setOgDetected(true); }
        } catch (ogErr) {
          console.error("[add-item] og:image fetch failed:", ogErr);
        } finally {
          setImageLoading(false);
        }
      }, 600);
    }
  }, [imageUrl]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageLoading(true);
    try {
      const url = await uploadPlanningImage(file);
      setImageUrl(url);
      setOgDetected(false);
    } catch (uploadErr) {
      console.error("[add-item] image upload failed:", uploadErr);
    } finally {
      setImageLoading(false);
    }
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) { setTags((p) => [...p, tag]); }
    setTagInput("");
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); addTag(); }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((p) => p.slice(0, -1));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      await onSave({
        title: title.trim(),
        description: description.trim() || undefined,
        imageUrl: imageUrl || null,
        priceValue: priceValue ? parseFloat(priceValue) : null,
        priceCurrency,
        quantity,
        priority,
        status,
        tags,
        notes: notes.trim() || undefined,
        links: links.filter((l) => l.url.trim()).map((l) => ({ label: l.label.trim() || undefined, url: l.url.trim() })) as { label?: string; url: string }[],
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-2xl border border-zinc-200/80 dark:border-zinc-800 shadow-2xl my-auto">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">
            {editingItem ? "Editar Item" : "Agregar Item"}
          </h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
            <X className="w-4 h-4 text-zinc-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Imagen</label>
            {imageUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 h-40">
                <NextImage src={imageUrl} alt="preview" fill sizes="(max-width: 640px) 100vw, 512px" className="object-cover" />
                {ogDetected && (
                  <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan-500/90 text-white text-xs">
                    <Wand2 className="w-3 h-3" /> Detectada automáticamente
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => { setImageUrl(null); setOgDetected(false); }}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-lg bg-black/60 hover:bg-black/80 transition-colors"
                >
                  <X className="w-3.5 h-3.5 text-white" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={imageLoading}
                  className={cn(
                    "flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm transition-colors",
                    "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-cyan-400 hover:text-cyan-500"
                  )}
                >
                  {imageLoading ? <div className="w-4 h-4 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                  Subir imagen
                </button>
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-400">
                  <ImageOff className="w-4 h-4" />
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Título *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="ej: Juego de ollas Tramontina" required autoFocus
              className={cn("w-full px-3.5 py-2.5 rounded-xl border text-sm", "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100 placeholder-zinc-400", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")} />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Descripción</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Descripción del item..."
              className={cn("w-full px-3.5 py-2.5 rounded-xl border text-sm resize-none", "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100 placeholder-zinc-400", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")} />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Precio unit.</label>
              <input value={priceValue} onChange={(e) => setPriceValue(e.target.value)} type="number" min="0" step="0.01" placeholder="0.00"
                className={cn("w-full px-3 py-2.5 rounded-xl border text-sm", "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100 placeholder-zinc-400", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")} />
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Moneda</label>
              <select value={priceCurrency} onChange={(e) => setPriceCurrency(e.target.value as PlanningCurrency)}
                className={cn("w-full px-3 py-2.5 rounded-xl border text-sm", "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")}>
                {CURRENCIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="col-span-1">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Cantidad</label>
              <input value={quantity} onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))} type="number" min="1" step="1"
                className={cn("w-full px-3 py-2.5 rounded-xl border text-sm", "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Prioridad</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value as ItemPriority)}
              className={cn("w-full px-3 py-2.5 rounded-xl border text-sm", "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")}>
              {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">Etiquetas</label>
            <div className={cn("flex flex-wrap gap-1.5 px-3 py-2 rounded-xl border min-h-[42px]", "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800")}>
              {tags.map((tag) => (
                <span key={tag} className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-100 dark:bg-cyan-950/50 text-cyan-700 dark:text-cyan-300 text-xs">
                  {tag}
                  <button type="button" onClick={() => setTags((p) => p.filter((t) => t !== tag))} className="hover:text-cyan-900"><X className="w-2.5 h-2.5" /></button>
                </span>
              ))}
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "Agregar etiqueta y presionar Enter..." : ""}
                className="flex-1 min-w-24 bg-transparent text-sm text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 outline-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Links de referencia</label>
              <button type="button" onClick={() => setLinks((p) => [...p, { label: "", url: "" }])}
                className="flex items-center gap-1 text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Agregar
              </button>
            </div>
            <div className="space-y-2">
              {links.map((link, idx) => (
                <div key={idx} className="flex gap-2">
                  <input value={link.label} onChange={(e) => setLinks((p) => p.map((l, i) => i === idx ? { ...l, label: e.target.value } : l))}
                    placeholder="Mercado Libre" className={cn("w-28 px-3 py-2 rounded-xl border text-xs", "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100 placeholder-zinc-400", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")} />
                  <input value={link.url} onChange={(e) => handleLinkUrlChange(idx, e.target.value)}
                    placeholder="https://..." className={cn("flex-1 px-3 py-2 rounded-xl border text-xs", "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800", "text-zinc-900 dark:text-zinc-100 placeholder-zinc-400", "focus:outline-none focus:ring-2 focus:ring-cyan-500/30 focus:border-cyan-500 transition")} />
                  <button type="button" onClick={() => setLinks((p) => p.filter((_, i) => i !== idx))}
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-400 transition-colors flex-shrink-0 self-center">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={isSaving || !title.trim()}
              className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-white text-sm font-medium transition-colors">
              {isSaving ? "Guardando..." : editingItem ? "Guardar cambios" : "Agregar item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
