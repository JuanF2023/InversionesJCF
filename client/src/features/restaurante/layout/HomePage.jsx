import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MesaModal from '../../components/ui/modals/MesaModal';
import { ShoppingBag, User, UtensilsCrossed } from 'lucide-react';

const mesasIniciales = [
  { id: 1, ocupada: false },
  { id: 2, ocupada: false },
  { id: 3, ocupada: false },
  { id: 4, ocupada: false },
  { id: 5, ocupada: false },
  { id: 6, ocupada: false },
  { id: 7, ocupada: false },
];

const HomePage = () => {
  const navigate = useNavigate();
  const [mesas, setMesas] = useState(mesasIniciales);
  const [tipoOrden, setTipoOrden] = useState('');
  const [mesaSeleccionada, setMesaSel] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const seleccionarMesa = (mesa) => {
    if (mesa.ocupada) return;
    setTipoOrden('comerAqui');
    setMesaSel(mesa.id);
    setMostrarModal(true);
  };

  const confirmarCantidad = (cantidad) => {
    setMesas((prev) =>
      prev.map((m) =>
        m.id === mesaSeleccionada ? { ...m, ocupada: true } : m
      )
    );
    setMostrarModal(false);
    navigate('/orden-builder', {
      state: {
        tipoOrden: 'comerAqui',
        mesaId: mesaSeleccionada,
        personas: cantidad,
      },
    });
  };

  const iniciarOrdenSinMesa = (tipo) => {
    const tipoConvertido =
      tipo === 'llevar' ? 'paraLlevar' : tipo === 'empleado' ? 'empleado' : tipo;

    setTipoOrden(tipoConvertido);
    navigate('/orden-builder', {
      state: {
        tipoOrden: tipoConvertido,
        mesa: null,
        personas: 1,
      },
    });
  };

  return (
    <div className="flex-1 flex items-start justify-center px-4 pt-8 pb-6">
      <div className="w-full max-w-screen-lg bg-slate-800/90 rounded-xl p-6 shadow-2xl border border-yellow-400">
        {/* Encabezado */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-white pb-1 w-fit">
            Plano de mesas
          </h2>

          <p className="text-sm text-slate-300 mt-1">
            Selecciona una mesa disponible o elige una opci¨®n r¨¢pida
          </p>

          {/* Botones r¨¢pidos */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg border border-yellow-400 shadow transition-all hover:scale-105 hover:shadow-lg"
              onClick={() => iniciarOrdenSinMesa('llevar')}
            >
              <ShoppingBag size={18} />
              Para llevar
            </button>

            <button
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base font-semibold rounded-lg border border-yellow-400 shadow transition-all hover:scale-105 hover:shadow-lg"
              onClick={() => iniciarOrdenSinMesa('empleado')}
            >
              <User size={18} />
              Comida empleado
            </button>
          </div>
        </div>

        {/* Separador visual */}
        <div className="border-t border-yellow-400 mb-6" />

        {/* Grid de mesas */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-1 gap-4">
          {mesas.map((mesa) => (
            <div className="relative" key={mesa.id}>
              <button
                title={mesa.ocupada ? 'Mesa en uso' : 'Disponible'}
                disabled={mesa.ocupada}
                onClick={() => seleccionarMesa(mesa)}
                className={`w-full flex items-center justify-center gap-2 
    text-base sm:text-lg md:text-xl font-semibold 
    px-4 py-4 rounded-xl border border-yellow-400
    transition-all duration-300 ease-in-out
    ${mesa.ocupada
                    ? 'bg-gray-700 text-white cursor-not-allowed opacity-80'
                    : 'bg-gradient-to-r from-slate-800 to-slate-700 text-white hover:scale-105 hover:shadow-lg'}
  `}
              >
                <div className="bg-white/90 p-2 rounded-lg shadow-sm">
                  <UtensilsCrossed size={22} className="text-[#0ea5e9]" />
                </div>
                <span className="whitespace-nowrap">
                  Mesa {mesa.id} <span className="ml-1 text-3xl leading-none">??</span>

                </span>
                {mesa.ocupada && (
                  <span className="text-red-400 text-xs ml-2 font-medium">
                    (Ocupada)
                  </span>
                )}
              </button>

            </div>
          ))}
        </div>
      </div>

      {/* Modal de selecci¨®n de personas */}
      <MesaModal
        isOpen={mostrarModal}
        mesaId={mesaSeleccionada}
        onClose={() => setMostrarModal(false)}
        onConfirm={confirmarCantidad}
      />
    </div>
  );
};

export default HomePage;
