import React, { useState } from "react";

const UnidadForm = () => {
  const [nombre, setNombre] = useState("");

  const [unidades, setUnidades] = useState([
    { id: "med_1", nombre: "oz" },
    { id: "med_2", nombre: "piezas" },
    { id: "med_3", nombre: "rodajas" },
    { id: "med_4", nombre: "unidades" },
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevaUnidad = {
      id: `med_${unidades.length + 1}`,
      nombre,
      creadoPor: "sistema",
      fechaCreacion: new Date().toISOString(),
    };

    setUnidades([...unidades, nuevaUnidad]);
    setNombre("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 text-white">
      {/* Formulario izquierda */}
      <div className="bg-[#1a2238] p-6 rounded-xl border border-yellow-500">
        <h2 className="text-xl font-bold text-yellow-300 mb-1 flex items-center gap-2">
          ⚖️ Unidades de Medida
        </h2>
        <p className="text-sm text-slate-300 mb-4">Registra una nueva unidad.</p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm text-slate-300 mb-1">
              Nombre de la unidad
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej. gramos, ml, porciones"
              required
              className="w-full px-4 py-2 bg-[#2c3e50] text-white rounded-md"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded-md"
            >
              Guardar unidad
            </button>
          </div>
        </form>
      </div>

      {/* Tabla derecha */}
      <div className="bg-[#1a2238] p-6 rounded-xl border border-yellow-500 min-h-[400px] text-white">
        <h3 className="text-lg font-bold text-yellow-300 mb-2">
          Unidades registradas
        </h3>
        <table className="w-full text-sm text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-yellow-200">
              <th>ID</th>
              <th>Nombre</th>
            </tr>
          </thead>
          <tbody>
            {unidades.map((unidad) => (
              <tr key={unidad.id} className="text-white">
                <td>{unidad.id}</td>
                <td>{unidad.nombre}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnidadForm;
