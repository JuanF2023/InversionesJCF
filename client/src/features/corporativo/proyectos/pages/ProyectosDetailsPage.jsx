import React from "react";
import { useParams } from "react-router-dom";

export default function ProyectosDetailsPage() {
  const { id } = useParams();
  return (
    <div className="space-y-2">
      <div className="text-sm subtle">Detalle del proyecto</div>
      <div className="rounded-xl border border-border/60 p-3">
        ID: <b>{id}</b>
      </div>
    </div>
  );
}
