"use client";
import { useEffect, useState } from "react";

type ToastMsg = { id: number; text: string };
let pushToastExternal: ((text: string) => void) | null = null;
export const pushToast = (text: string) => pushToastExternal?.(text);

export function Toaster() {
  const [items, setItems] = useState<ToastMsg[]>([]);
  useEffect(() => {
    pushToastExternal = (text) => {
      const id = Date.now();
      setItems((s) => [...s, { id, text }]);
      setTimeout(() => setItems((s) => s.filter(t => t.id !== id)), 3000);
    };
    return () => { pushToastExternal = null; };
  }, []);
  return (
    <div className="fixed bottom-6 right-6 space-y-2 z-50">
      {items.map(t => (
        <div key={t.id} className="card px-4 py-3 text-sm">{t.text}</div>
      ))}
    </div>
  );
}