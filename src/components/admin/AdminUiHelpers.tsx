import React from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: number;
  type: 'success' | 'error' | 'info';
  text: string;
}

export interface ConfirmDialogState {
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void | Promise<void>;
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastMessage[];
  onDismiss: (id: number) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[99999] flex flex-col gap-2 max-w-sm w-[calc(100%-2.5rem)] pointer-events-none">
      {toasts.map((t) => {
        const styleMap = {
          success: 'bg-emerald-900 text-white border-emerald-500',
          error: 'bg-red-900 text-white border-red-500',
          info: 'bg-slate-900 text-white border-sky-500',
        }[t.type];

        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-2.5 px-4 py-3 rounded-xl border shadow-xl text-sm font-semibold ${styleMap}`}
          >
            <span className="mt-0.5 shrink-0">
              {t.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-300" />}
              {t.type === 'error' && <AlertTriangle className="w-4 h-4 text-red-300" />}
              {t.type === 'info' && <Info className="w-4 h-4 text-sky-300" />}
            </span>
            <span className="flex-1 leading-snug">{t.text}</span>
            <button
              type="button"
              onClick={() => onDismiss(t.id)}
              className="opacity-70 hover:opacity-100 cursor-pointer"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export function ConfirmModal({
  dialog,
  busy,
  onCancel,
  onConfirm,
}: {
  dialog: ConfirmDialogState | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!dialog) return null;

  return (
    <div
      className="fixed inset-0 z-[99998] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget && !busy) onCancel();
      }}
    >
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-5">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              dialog.danger ? 'bg-red-100 text-red-600' : 'bg-sky-100 text-sky-600'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="text-base font-extrabold text-slate-900 m-0">{dialog.title}</h4>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed whitespace-pre-line">
              {dialog.message}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-5 pt-3 border-t border-slate-100">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="px-4 py-2 text-sm font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg cursor-pointer transition-colors disabled:opacity-50"
          >
            रद्द करें
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-bold text-white rounded-lg cursor-pointer transition-colors disabled:opacity-50 ${
              dialog.danger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-sky-600 hover:bg-sky-700'
            }`}
          >
            {busy ? 'प्रक्रिया जारी...' : dialog.confirmLabel || 'पुष्टि करें'}
          </button>
        </div>
      </div>
    </div>
  );
}
