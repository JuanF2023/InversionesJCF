// client/src/features/corporativo/proyectos/ProyectosFormPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import BaseFormPage from "@/shared/ui/layout/BaseFormPage.jsx";
import FormSectionCard from "@/shared/ui/layout/FormSectionCard.jsx";
import FormFooter from "@/shared/ui/layout/FormFooter.jsx";
import Field, { fieldControlClass } from "@/shared/ui/forms/Field.jsx";

import { useProyectosStore } from "@/features/corporativo/proyectos/store/proyectos.store.js";

const cx = (...c) => c.filter(Boolean).join(" ");

const FORM_DEFAULTS = {
  nombre: "",
  codigo: "",
  descripcion: "",
};

export default function ProyectosFormPage() {
  const navigate = useNavigate();
  const { search, state } = useLocation();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const proyectos = useProyectosStore((s) => s.proyectos || []);

  const [form, setForm] = useState(FORM_DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const goBack = () => {
    navigate(`/corporativo/proyectos${search || ""}`);
  };

  /* ------------------ precarga edición ------------------ */
  useEffect(() => {
    if (!isEdit || prefilled) return;

    const fromState = state?.proyecto || state?.project || null;

    if (fromState) {
      setForm({
        nombre: fromState.nombre ?? fromState.name ?? "",
        codigo: fromState.codigo ?? fromState.code ?? "",
        descripcion: fromState.descripcion ?? "",
      });
      setPrefilled(true);
      return;
    }

    const list = Array.isArray(proyectos) ? proyectos : [];

    const existing = list.find(
      (p) =>
        String(p.id ?? p._id ?? p.codigo).toLowerCase() ===
        String(id).toLowerCase()
    );

    if (existing) {
      setForm({
        nombre: existing.nombre ?? existing.name ?? "",
        codigo: existing.codigo ?? existing.code ?? "",
        descripcion: existing.descripcion ?? "",
      });
      setPrefilled(true);
    }
  }, [isEdit, prefilled, state, id, proyectos]);

  /* ------------------ helpers ------------------ */
  const setField = (field) => (e) => {
    const value = e?.target?.value ?? "";
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const markTouched = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const validate = (nextForm = form) => {
    const next = {};

    if (!nextForm.nombre.trim()) {
      next.nombre = "El nombre del proyecto es obligatorio.";
    } else if (nextForm.nombre.trim().length < 3) {
      next.nombre = "El nombre debe tener al menos 3 caracteres.";
    }

    if (nextForm.codigo.trim() && nextForm.codigo.trim().length < 3) {
      next.codigo = "Si ingresas un código, usa al menos 3 caracteres.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const canSubmit = useMemo(() => validate(form), [form]);

  /* ------------------ submit ------------------ */
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (saving) return;

    setTouched({
      nombre: true,
      codigo: true,
      descripcion: true,
    });

    if (!validate(form)) return;

    const payload = {
      nombre: form.nombre.trim(),
      codigo: form.codigo.trim(),
      descripcion: form.descripcion.trim(),
      id: id || null,
    };

    try {
      setSaving(true);

      console.log(
        isEdit
          ? "[ProyectosFormPage] Editar proyecto:"
          : "[ProyectosFormPage] Crear proyecto:",
        payload
      );

      alert(
        isEdit
          ? "Proyecto actualizado (demo)."
          : "Proyecto creado (demo)."
      );

      goBack();
    } catch (err) {
      console.error("Error guardando proyecto:", err);
      alert("No se pudo guardar el proyecto.");
    } finally {
      setSaving(false);
    }
  };

  const title = isEdit ? "Editar proyecto" : "Agregar proyecto";

  const description = isEdit
    ? "Actualiza la información del proyecto."
    : "Registra un nuevo proyecto.";

  return (
    <BaseFormPage title={title} description={description} onBack={goBack}>
      <form
        id="proyecto-form"
        onSubmit={handleSubmit}
        className="neo-card neo-card--deep neo-card--tinted w-full rounded-2xl p-4 md:p-6 space-y-6"
      >
        <FormSectionCard title="Datos principales del proyecto">
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Nombre del proyecto"
              required
              error={touched.nombre ? errors.nombre : ""}
            >
              <input
                type="text"
                value={form.nombre}
                onChange={setField("nombre")}
                onBlur={markTouched("nombre")}
                className={fieldControlClass({
                  error: touched.nombre && errors.nombre,
                  ok:
                    touched.nombre &&
                    !errors.nombre &&
                    form.nombre.trim().length > 0,
                })}
                placeholder="Ej. Locales Comerciales 01"
              />
            </Field>

            <Field
              label="Código interno"
              hint="Opcional"
              error={touched.codigo ? errors.codigo : ""}
            >
              <input
                type="text"
                value={form.codigo}
                onChange={setField("codigo")}
                onBlur={markTouched("codigo")}
                className={fieldControlClass({
                  error: touched.codigo && errors.codigo,
                })}
                placeholder="Ej. PROY-001"
              />
            </Field>
          </div>

          <div className="mt-4">
            <Field label="Descripción" hint="Opcional">
              <textarea
                rows={4}
                value={form.descripcion}
                onChange={setField("descripcion")}
                className={cx("neo-textarea", fieldControlClass())}
                placeholder="Descripción del proyecto"
              />
            </Field>
          </div>
        </FormSectionCard>

        <FormFooter
          onCancel={goBack}
          isSubmitting={saving}
          canSubmit={canSubmit}
          submitLabel={isEdit ? "Guardar cambios" : "Agregar proyecto"}
        />
      </form>
    </BaseFormPage>
  );
}
