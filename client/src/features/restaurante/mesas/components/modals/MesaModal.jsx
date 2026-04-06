import React from 'react';

const MesaModal = ({ isOpen, onClose, mesaId, onConfirm }) => {
  const [cantidad, setCantidad] = React.useState('');

  const handleConfirm = () => {
    const num = parseInt(cantidad);
    if (!isNaN(num) && num > 0) {
      onConfirm(num);
      setCantidad('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-800 text-white rounded-xl p-6 w-80 border border-yellow-400 shadow-xl">
        <h2 className="text-lg font-bold mb-4">
          ?Cu¨¢ntas personas hay en la Mesa {mesaId}?
        </h2>

        <input
          type="number"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
          className="w-full px-4 py-2 mb-4 rounded-md bg-slate-700 text-white border border-yellow-400 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          placeholder="Ej: 2"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            disabled={!cantidad}
            className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold border border-yellow-400 shadow transition-all disabled:opacity-50"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

export default MesaModal;
