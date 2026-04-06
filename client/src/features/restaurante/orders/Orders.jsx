// Orders.jsx actualizado con estructura mock y l車gica completa
import React, { useState, useEffect } from "react";
import { Search, RefreshCcw, DoorOpen, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const navigate = useNavigate();

  const [busqueda, setBusqueda] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("abierta");
  const [ordenes, setOrdenes] = useState([]);

  // Mock estructurado para futura conexi車n con backend
  useEffect(() => {
    const mockData = [
      {
        id: "ORD001",
        mesa: "1",
        estado: "abierta",
        pagada: false,
        total: 18.75,
        fecha: "2025-07-12T09:45:00",
        usuario: "Juan P谷rez"
      },
      {
        id: "ORD002",
        mesa: "2",
        estado: "cerrada",
        pagada: true,
        total: 27.50,
        fecha: "2025-07-11T17:10:00",
        usuario: "Ana Mart赤nez"
      },
      {
        id: "ORD003",
        mesa: "3",
        estado: "abierta",
        pagada: false,
        total: 13.90,
        fecha: "2025-07-12T10:30:00",
        usuario: "Carlos L車pez"
      }
    ];
    setOrdenes(mockData);
  }, []);

  const limpiarFiltros = () => {
    setBusqueda("");
    setEstadoFiltro("abierta");
  };

  const ordenesFiltradas = ordenes.filter((orden) => {
    const coincideBusqueda = orden.mesa.toLowerCase().includes(busqueda.toLowerCase());
    const coincideEstado = estadoFiltro === "todas" || orden.estado === estadoFiltro;
    return coincideBusqueda && coincideEstado;
  });

  const handleEntrarOrden = (ordenId) => {
    navigate(`/orden/${ordenId}`); // Esto apunta a OrderBuilder.jsx con ID
  };
  const totalPendiente = ordenes
  .filter((orden) => orden.estado === "abierta" && orden.pagada === false)
  .reduce((acc, orden) => acc + orden.total, 0);


  return (
    <div className="flex-1 flex items-start justify-center px-4 pt-8 pb-6">
  <div className="w-full max-w-screen-xl bg-slate-800/90 rounded-xl p-6 shadow-2xl border border-yellow-400">

    {/* Encabezado */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-white pb-1 w-fit">
        車rdenes
      </h2>
      <p className="text-sm text-slate-300 mt-1">
        Gesti車n de 車rdenes abiertas y cerradas
      </p>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
        <input
          type="text"
          placeholder="Buscar por mesa"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="px-3 py-2 rounded text-black w-40 text-sm"
        />
        <select
          value={estadoFiltro}
          onChange={(e) => setEstadoFiltro(e.target.value)}
          className="px-3 py-2 rounded text-black w-36 text-sm"
        >
          <option value="todas">Todos los estados</option>
          <option value="abierta">Abiertas</option>
          <option value="cerrada">Cerradas</option>
        </select>
        <button
          onClick={limpiarFiltros}
          className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 px-3 py-2 rounded text-white text-sm shadow flex items-center gap-1"
        >
          <RefreshCcw size={14} /> Limpiar
        </button>
      </div>
    </div>

    {/* Tabla de 車rdenes */}
    {/* Tabla de 車rdenes para pantallas medianas en adelante */}
<div className="hidden md:block overflow-x-auto border border-yellow-400 rounded-lg">
  <table className="min-w-full text-sm text-left">
    <thead className="bg-slate-900 text-yellow-400 uppercase text-xs">
      <tr>
        <th className="px-4 py-3">Orden</th>
        <th className="px-4 py-3">Mesa</th>
        <th className="px-4 py-3">Estado</th>
        <th className="px-4 py-3">Pago</th>
        <th className="px-4 py-3">Total</th>
        <th className="px-4 py-3">Fecha</th>
        <th className="px-4 py-3">Usuario</th>
        <th className="px-4 py-3">Acciones</th>
      </tr>
    </thead>
    <tbody className="text-white bg-slate-800">
      {ordenesFiltradas.map((orden) => (
        <tr key={orden.id} className="border-b border-slate-700 hover:bg-slate-700/40">
          <td className="px-4 py-3">{orden.id}</td>
          <td className="px-4 py-3">{orden.mesa}</td>
          <td className="px-4 py-3 capitalize">{orden.estado}</td>
          <td className="px-4 py-3">{orden.pagada ? "Pagada" : "Pendiente"}</td>
          <td className="px-4 py-3">${orden.total.toFixed(2)}</td>
          <td className="px-4 py-3">{new Date(orden.fecha).toLocaleString()}</td>
          <td className="px-4 py-3">{orden.usuario}</td>
          <td className="px-4 py-3">
            <div className="flex gap-2">
              {orden.estado === "abierta" ? (
                <button
                  onClick={() => handleEntrarOrden(orden.id)}
                  className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 shadow"
                >
                  <DoorOpen size={14} /> Entrar
                </button>
              ) : (
                <span className="text-gray-400 italic text-sm">Cerrada</span>
              )}
              <button
                className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-black px-3 py-1 rounded-md text-sm flex items-center gap-1 shadow"
              >
                <Printer size={14} /> Recibo
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

{/* Vista tipo tarjeta para pantallas peque?as */}
<div className="block md:hidden space-y-4">
  {ordenesFiltradas.map((orden) => (
    <div
      key={orden.id}
      className="border border-yellow-400 rounded-lg p-4 bg-slate-800 text-white shadow"
    >
      <div className="font-bold text-lg mb-1">{orden.id}</div>
      <div className="text-sm mb-1">Mesa: <span className="font-medium">{orden.mesa}</span></div>
      <div className="text-sm mb-1">Estado: <span className="capitalize">{orden.estado}</span></div>
      <div className="text-sm mb-1">Pago: {orden.pagada ? "Pagada" : "Pendiente"}</div>
      <div className="text-sm mb-1">Total: ${orden.total.toFixed(2)}</div>
      <div className="text-sm mb-1">Fecha: {new Date(orden.fecha).toLocaleString()}</div>
      <div className="text-sm mb-3">Usuario: {orden.usuario}</div>
      <div className="flex gap-2 flex-wrap">
        {orden.estado === "abierta" ? (
          <button
            onClick={() => handleEntrarOrden(orden.id)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center gap-1 shadow"
          >
            <DoorOpen size={14} /> Entrar
          </button>
        ) : (
          <span className="text-gray-400 italic text-sm">Cerrada</span>
        )}
        <button
          className="bg-gradient-to-r from-yellow-400 to-yellow-300 hover:from-yellow-500 hover:to-yellow-400 text-black px-3 py-1 rounded-md text-sm flex items-center gap-1 shadow"
        >
          <Printer size={14} /> Recibo
        </button>
      </div>
    </div>
  ))}
</div>


    {/* Estad赤sticas */}
    <div className="mt-6 text-sm text-slate-300">
      <p>Total de 車rdenes: {ordenesFiltradas.length}</p>
      <p>
      <p>Total pendiente: ${totalPendiente.toFixed(2)}</p>

      </p>
    </div>
  </div>
</div>

  );
};

export default Orders;
