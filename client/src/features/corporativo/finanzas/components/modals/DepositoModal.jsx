// src/features/corporativo/negocios/components/DepositoModal.jsx
import React, { useEffect, useState } from "react";
import { X, Banknote, Save } from "lucide-react";

const cx = (...c) => c.filter(Boolean).join(" ");
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function DepositoModal({ open, onClose, onSubmit, defaultMonto = 0, theme }) {
  const [form, setForm] = useState({
    fecha: todayISO(),
    banco: "",
    boleta: "",
    quien: "",
    monto: defaultMonto || 0,
  });

  useEffect(() => {
    if (!open) return;
    setForm((f) => ({
      ...f,
      fecha: todayISO(),
      monto: defaultMonto || 0,
    }));
  }, [open, defaultMonto]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[430]" data-theme={theme}>
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(520px,95vw)] neo-card p-4 md:p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold inline-flex items-center gap-2">
            <Banknote size={18} /> Registrar dep¨®sito
          </h3>
          <button className="neo-plate px-3 py-1.5" onClick={onClose}><X size={16}/> Cerrar</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs subtle mb-1">Fecha</label>
            <input type="date" className="neo-input w-full px-3 py-2"
                   max={todayISO()} value={form.fecha}
                   onChange={(e)=>setForm({...form, fecha: e.target.value})}/>
          </div>
          <div>
            <label className="block text-xs subtle mb-1">Banco</label>
            <input className="neo-input w-full px-3 py-2" placeholder="Bac / Agr¨ªcola?? value={form.banco}
                   onChange={(e)=>setForm({...form, banco: e.target.value})}/>
          </div>
          <div>
            <label className="block text-xs subtle mb-1">No. boleta / remesa</label>
            <input className="neo-input w-full px-3 py-2" value={form.boleta}
                   onChange={(e)=>setForm({...form, boleta: e.target.value})}/>
          </div>
          <div>
            <label className="block text-xs subtle mb-1">Qui¨¦n abon¨®</label>
            <input className="neo-input w-full px-3 py-2" placeholder="Gerente / Colector / Inquilino" value={form.quien}
                   onChange={(e)=>setForm({...form, quien: e.target.value})}/>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs subtle mb-1">Monto</label>
            <input type="number" step="0.01" min="0" className="neo-input w-full px-3 py-2"
                   value={form.monto}
                   onChange={(e)=>setForm({...form, monto: Number(e.target.value || 0)})}/>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button className="neo-plate px-4 py-2" onClick={onClose}>Cancelar</button>
          <button
            className="btn-gradient btn-action"
            onClick={() => onSubmit?.(form)}
          >
            <Save size={16} className="mr-1"/> Guardar
          </button>
        </div>
      </div>
    </div>
  );
}


