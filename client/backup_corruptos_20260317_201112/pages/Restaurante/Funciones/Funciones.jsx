import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCog,
  Clock,
  Percent,
  Globe,
  UtensilsCrossed,
  DollarSign,   // ⬅️ nuevo icono
} from 'lucide-react';

const funciones = [
  {
    titulo: 'Gestión de menú',
    descripcion: 'Platos, porciones, categorías y precios',
    icono: <UtensilsCrossed size={36} className="text-[#0ea5e9]" />,
    ruta: '/menu'
  },
  {
    titulo: 'Usuarios y roles',
    descripcion: 'Gestiona meseros, cocineros y gerentes',
    icono: <UserCog size={36} className="text-[#0ea5e9]" />,
    ruta: '/funciones/usuarios'
  },
  {
    titulo: 'Turnos y entradas',
    descripcion: 'Controla registros de entrada y salida',
    icono: <Clock size={36} className="text-[#0ea5e9]" />,
    ruta: '/funciones/turnos'
  },
  {
    titulo: 'Propinas e impuestos',
    descripcion: 'Define cargos automáticos por servicio',
    icono: <Percent size={36} className="text-[#0ea5e9]" />,
    ruta: '/funciones/impuestos'
  },
  
  {
    titulo: 'Registro de costos',
    descripcion: 'Compras, servicios, nómina, impuestos y más',
    icono: <DollarSign size={36} className="text-[#0ea5e9]" />,
    ruta: '/funciones/costos'
  },
  {
    titulo: 'Parámetros generales',
    descripcion: 'Nombre del restaurante, idioma, zona horaria, horario...',
    icono: <Globe size={36} className="text-[#0ea5e9]" />,
    ruta: '/funciones/configuracion'
  }
];

const Funciones = () => {
  const navigate = useNavigate();

  const handleKey = (e, ruta) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigate(ruta);
    }
  };

  return (
    <div className="p-6">
      <div className="text-white text-3xl font-bold mb-6">
        Funciones del Restaurante
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {funciones.map((f, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            aria-label={f.titulo}
            onClick={() => navigate(f.ruta)}
            onKeyDown={(e) => handleKey(e, f.ruta)}
            className="bg-gradient-to-r from-slate-800 to-slate-700 text-white p-5 rounded-xl 
                       border border-yellow-400 shadow hover:scale-105 hover:shadow-lg 
                       transition-all duration-300 ease-in-out cursor-pointer focus:outline-none
                       focus:ring-2 focus:ring-yellow-400/60"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-white/90 p-2 rounded-lg shadow-sm">{f.icono}</div>
              <h2 className="text-xl font-semibold">{f.titulo}</h2>
            </div>
            <p className="text-sm opacity-90">{f.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Funciones;
