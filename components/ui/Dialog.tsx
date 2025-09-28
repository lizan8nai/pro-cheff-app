"use client";
import { ReactNode } from "react";
export function Dialog({ open, onClose, children }:{
  open: boolean; onClose: () => void; children: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60">
      <div className="card w-[min(560px,92vw)]">
        <div className="p-5">{children}</div>
        <div className="p-3 pt-0 text-right">
          <button className="text-muted hover:text-white" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}