// src/components/layouts/RestauranteLayout.jsx
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
  Home,
  ListOrdered,
  FileBarChart,
  Settings,
  Menu as MenuIcon,
  X,
  TrendingUp, // <- agregado
} from 'lucide-react';

const RestauranteLayout = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const mainRef = useRef(null);

  useEffect(() => {
    const el = mainRef.current;
    if (!el) return;
    const onScroll = () => setScrolled(el.scrollTop > 0);
    el.addEventListener('scroll', onScroll);
    onScroll();
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setMenuAbierto(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const fecha = new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date()).toUpperCase();

  const navLinkClass = ({ isActive }) =>
    `relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-base font-bold
     border-2 transition-all duration-200 ease-in-out
     ${
       isActive
         ? 'bg-gradient-to-r from-blue-700 to-blue-600 text-white border-yellow-400 shadow-lg scale-105 ' +
           'after:absolute after:-bottom-2 after:left-4 after:right-4 after:h-0.5 after:bg-yellow-400 after:rounded-full'
         : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-yellow-400/50 hover:scale-105 hover:shadow-md'
     }`;

  const cerrarMenu = () => setMenuAbierto(false);

  return (
    <div className="flex flex-col min-h-screen bg-slate-900">
      {/* NAVBAR SUPERIOR */}
      <header
        className={`sticky top-0 z-50 border-b border-yellow-400/70 
                    bg-slate-800/85 backdrop-blur supports-[backdrop-filter]:bg-slate-800/70
                    ${scrolled ? 'shadow-md' : 'shadow-none'}`}
      >
        <div className="max-w-screen-2xl mx-auto px-4 py-3 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            {/* T¨ªTULO + FECHA + HAMBURGUESA */}
            <div className="flex items-center justify-between md:justify-start w-full">
              <div>
                <h1 className="text-3xl font-bold text-yellow-400">Sistema de Restaurante</h1>
                <p className="text-lg text-blue-200">Sucursal Chaparral ¡¤ {fecha}</p>
              </div>
              <button
                onClick={() => setMenuAbierto((v) => !v)}
                className="md:hidden text-white p-2"
                aria-label="Abrir men¨²"
                aria-expanded={menuAbierto}
                aria-controls="main-nav"
              >
                {menuAbierto ? <X size={28} /> : <MenuIcon size={28} />}
              </button>
            </div>

            {/* NAV ENLACES */}
            <nav
              id="main-nav"
              className={`flex flex-col md:flex-row gap-2 mt-3 md:mt-0 transition-all duration-300 
                          ${menuAbierto ? 'flex' : 'hidden md:flex'}`}
            >
              <NavLink to="/home" className={navLinkClass} onClick={cerrarMenu}>
                <Home size={20} /> Inicio
              </NavLink>

              <NavLink to="/ordenes" className={navLinkClass} onClick={cerrarMenu}>
                <ListOrdered size={20} /> ¨®rdenes
              </NavLink>

              {/* Reportes (reemplaza al antiguo 'Men¨²') */}
              <NavLink to="/reportes-salida" className={navLinkClass} onClick={cerrarMenu}>
                <TrendingUp size={20} /> Reportes
              </NavLink>

              <NavLink to="/funciones" className={navLinkClass} onClick={cerrarMenu}>
                <Settings size={20} /> Funciones
              </NavLink>

              {/* KPI/Informes generales */}
              <NavLink to="/informes" className={navLinkClass} onClick={cerrarMenu}>
                <FileBarChart size={20} /> Informes
              </NavLink>
            </nav>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main
        ref={mainRef}
        className="flex-1 min-h-0 overflow-y-auto px-3 md:px-6 py-4 pb-24 flex flex-col"
      >
        <div className="w-[90%] mx-auto">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="fixed bottom-0 inset-x-0 z-50 bg-black/85 backdrop-blur border-t border-yellow-500/70">
        <div className="max-w-screen-2xl mx-auto px-4 md:px-8 py-3 text-center text-slate-200 text-sm md:text-base">
          Restaurante 01 ¡¤ <span className="text-white">Sucursal Chaparral</span> ¡¤ Dispositivo{' '}
          <span className="text-yellow-400 font-semibold">#1</span> ¡¤{' '}
          <span className="text-yellow-400">v1.0.0</span>
        </div>
      </footer>
    </div>
  );
};

export default RestauranteLayout;
