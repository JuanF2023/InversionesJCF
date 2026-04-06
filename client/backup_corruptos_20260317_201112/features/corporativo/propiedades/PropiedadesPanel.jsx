// client/src/features/corporativo/propiedades/PropiedadesPanel.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { usePropertiesStore } from "@/features/corporativo/propiedades/store/properties.store.js";

export default function PropiedadesPanel() {
  const navigate = useNavigate();
  const { items, loading, error, loadProperties, deleteProperty } =
    usePropertiesStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadProperties();
  }, [loadProperties]);

  const filteredItems = items.filter((item) => {
    if (search) {
      const term = search.toLowerCase();
      const matches =
        item.nombre?.toLowerCase().includes(term) ||
        item.codigo?.toLowerCase().includes(term) ||
        item.ubicacion?.pais?.toLowerCase().includes(term) ||
        item.ubicacion?.ciudad?.toLowerCase().includes(term);

      if (!matches) return false;
    }

    if (filter === "activas") return item.estado === "activo";
    if (filter === "vendidas") return item.estado === "vendida";
    if (filter === "inactivas") return item.estado === "inactiva";

    return true;
  });

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar esta propiedad?")) {
      await deleteProperty(id);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto" />
          <p className="mt-4 text-gray-600">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Building2 className="text-blue-600" />
          Panel de Propiedades
        </h1>

        <button
          onClick={() => navigate("/corporativo/propiedades/nueva")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <Plus size={18} />
          Nueva Propiedad
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Buscar por nombre, código, país..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter size={18} className="text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-slate-700 dark:border-slate-600"
            >
              <option value="all">Todas las propiedades</option>
              <option value="activas">Activas</option>
              <option value="vendidas">Vendidas</option>
              <option value="inactivas">Inactivas</option>
            </select>
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">No se encontraron propiedades</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((prop) => (
            <div
              key={prop.id}
              className="bg-white dark:bg-slate-800 rounded-lg shadow hover:shadow-lg transition-shadow"
            >
              <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">
                      {prop.nombre || "Sin nombre"}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {prop.codigo || "Sin código"}
                    </p>
                  </div>

                  <span
                    className={`px-2 py-1 text-xs rounded-full ${prop.estado === "activo"
                        ? "bg-green-100 text-green-700"
                        : prop.estado === "vendida"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {prop.estado || "desconocido"}
                  </span>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  {prop.ubicacion?.pais && (
                    <p className="text-gray-600">
                      <span className="font-medium">País:</span>{" "}
                      {prop.ubicacion.pais}
                    </p>
                  )}

                  {prop.ubicacion?.ciudad && (
                    <p className="text-gray-600">
                      <span className="font-medium">Ciudad:</span>{" "}
                      {prop.ubicacion.ciudad}
                    </p>
                  )}

                  {prop.ubicacion?.direccion && (
                    <p className="text-gray-600 truncate">
                      <span className="font-medium">Dirección:</span>{" "}
                      {prop.ubicacion.direccion}
                    </p>
                  )}

                  {prop.unidades && (
                    <p className="text-gray-600">
                      <span className="font-medium">Unidades:</span>{" "}
                      {prop.unidades.length}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    onClick={() => navigate(`/corporativo/propiedades/${prop.id}`)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                    title="Ver detalles"
                  >
                    <Eye size={18} />
                  </button>

                  <button
                    onClick={() =>
                      navigate(`/corporativo/propiedades/${prop.id}/editar`)
                    }
                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                    title="Editar"
                  >
                    <Edit size={18} />
                  </button>

                  <button
                    onClick={() => handleDelete(prop.id)}
                    className="p-2 hover:bg-red-50 text-red-600 hover:text-red-700 rounded-lg"
                    title="Eliminar"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}