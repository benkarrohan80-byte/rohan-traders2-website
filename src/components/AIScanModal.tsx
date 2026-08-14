import React, { useState } from "react";
import { X, Upload, Sparkles, FileText, Loader2, Image as ImageIcon, AlertCircle } from "lucide-react";
import { BillEntry, CurrencyConfig } from "../types";

interface AIScanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAutoParsedBill: (parsed: Partial<BillEntry>) => void;
  currency: CurrencyConfig;
}

export const AIScanModal: React.FC<AIScanModalProps> = ({
  isOpen,
  onClose,
  onAutoParsedBill,
  currency,
}) => {
  if (!isOpen) return null;

  const [rawText, setRawText] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size exceeds 5MB. Please upload a smaller file.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setError(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleScan = async () => {
    if (!rawText && !imagePreview) {
      setError("Please paste bill text or upload a receipt photo.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/parse-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: rawText,
          imageBase64: imagePreview,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to process bill.");
      }

      onAutoParsedBill(data.data);
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Error reading invoice with AI. You can enter details manually.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">AI Auto Tally Extractor</h2>
              <p className="text-[11px] text-slate-400">
                Upload receipt photo or paste invoice text to auto-fill bill details
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Photo upload drop area */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Option 1: Upload Receipt / Bill Photo
            </label>
            <div className="border-2 border-dashed border-slate-700 hover:border-indigo-500/50 rounded-xl p-4 text-center bg-slate-800/40 transition">
              {imagePreview ? (
                <div className="relative inline-block">
                  <img
                    src={imagePreview}
                    alt="Receipt preview"
                    className="max-h-40 rounded-lg mx-auto border border-slate-700 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute -top-2 -right-2 bg-rose-600 text-white p-1 rounded-full text-xs shadow-md"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center py-2">
                  <ImageIcon className="w-8 h-8 text-indigo-400 mb-1" />
                  <span className="text-xs text-slate-300 font-medium">
                    Click or drag invoice photo / screenshot
                  </span>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    Supports JPG, PNG, WEBP (Up to 5MB)
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Text Area Input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Option 2: Paste Raw Bill / Payment Note
            </label>
            <textarea
              rows={3}
              placeholder=""
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-800 bg-slate-900">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleScan}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-md shadow-indigo-500/20 transition cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>Parsing Bill...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Auto Fill Form</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
