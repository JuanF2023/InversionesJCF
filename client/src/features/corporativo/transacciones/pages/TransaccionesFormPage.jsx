// client/src/features/corporativo/transacciones/pages/TransaccionesFormPage.jsx
import React, { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTheme } from "@/core/theme/ThemeProvider.jsx";

import BaseFormPage from "@/shared/components/ui/layout/BaseFormPage.jsx";
import FormSectionCard from "@/shared/components/ui/layout/FormSectionCard.jsx";
import FormFooter from "@/shared/components/ui/layout/FormFooter.jsx";
import Field, { fieldControlClass } from "@/shared/components/ui/forms/Field.jsx";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const KIND_OPTIONS = [
  { value: "ingreso", label: "Ingreso" },
  { value: "costo", label: "Costo" },
];

const SUBTYPE_OPTIONS = [
  { value: "venta_servicios", label: "Ventas / servicios", kind: "ingreso" },
  { value: "renta", label: "Renta / alquiler", kind: "ingreso" },
  { value: "otros_ingresos", label: "Otros ingresos", kind: "ingreso" },
  { value: "liquidacion_obra", label: "Liquidación de obra / construcción", kind: "costo" },
  { value: "compra_propiedad", label: "Compra de propiedad / terreno", kind: "costo" },
  { value: "costo_operativo", label: "Costos operativos", kind: "costo" },
  { value: "inversion_mejoras", label: "Mejoras a inmuebles / CAPEX", kind: "costo" },
];

const ORIGEN_FONDOS_OPTIONS = [
  { value: "aporte_propietario", label: "Aporte propietario" },
  { value: "inversion_externa", label: "Inversión externa" },
  { value: "reinversion_negocio", label: "Reinversión de utilidades" },
  { value: "caja", label: "Caja" },
  { value: "banco", label: "Banco" },
];

export default function TransaccionesFormPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    kind: "costo",
    subtype: "",
    fecha: new Date().toISOString().slice(0, 10),
    negocioId: "",
    propiedadId: "",
    unidadId: "",
    monto: "",
    concepto: "",
    origenFondos: "",
    medioPago: "",
    referencia: "",
    notas: "",
  });

  const [touched, setTouched] = useState({});
  const [errors, setErrors] = useState({});

  const subtypeOptions = useMemo(
    () => SUBTYPE_OPTIONS.filter((option) => option.kind === form.kind),
    [form.kind]
  );

  const setField = (field) => (event) => {
    const value = event?.target?.value ?? "";

    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "kind" ? { subtype: "" } : {}),
    }));
  };

  const markTouched = (field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const goBack = () => navigate(-1);

  const validate = (nextForm = form) => {
    const next = {};
    const montoNum = Number(nextForm.monto);

    if (!nextForm.fecha) next.fecha = "Selecciona la fecha.";
    if (!nextForm.kind) next.kind = "Selecciona la dirección.";
    if (!nextForm.subtype) next.subtype = "Selecciona el tipo de transacción.";

    if (!nextForm.monto || Number.isNaN(montoNum) || montoNum <= 0) {
      next.monto = "Ingresa un monto mayor a 0.";
    }

    if (!nextForm.concepto?.trim() || nextForm.concepto.trim().length < 3) {
      next.concepto = "Ingresa un concepto de mínimo 3 caracteres.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const canSave = useMemo(() => {
    const montoNum = Number(form.monto);

    return Boolean(
      form.fecha &&
        form.kind &&
        form.subtype &&
        form.monto &&
        !Number.isNaN(montoNum) &&
        montoNum > 0 &&
        form.concepto.trim().length >= 3
    );
  }, [form]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setTouched({
      fecha: true,
      kind: true,
      subtype: true,
      monto: true,
      concepto: true,
    });

    if (!validate(form)) return;

    const payload = {
      ...form,
      id: id || null,
      monto: Number(form.monto || 0),
    };

    try {
      setSaving(true);

      console.log(
        isEdit
          ? "[TransaccionesFormPage] Editar transacción:"
          : "[TransaccionesFormPage] Crear transacción:",
        payload
      );

      alert(
        isEdit
          ? "Transacción actualizada (demo). Falta integrar API."
          : "Transacción registrada (demo). Falta integrar API."
      );

      goBack();
    } catch (error) {
      console.error("Error guardando transacción:", error);
      alert("No se pudo guardar la transacción.");
    } finally {
      setSaving(false);
    }
  };

  const title = isEdit ? "Editar transacción" : "Agregar transacción";
  const description = isEdit
    ? "Actualiza esta transacción. Afecta indicadores, reportes y paneles del corporativo."
    : "Registra ingresos y costos de cualquier negocio, proyecto o propiedad. Esta información alimenta indicadores, reportes y paneles del corporativo.";

  return (
    <BaseFormPage title={title} description={description} onBack={goBack}>
      <form
        onSubmit={handleSubmit}
        className="neo-card neo-card--deep neo-card--tinted no-clip w-full space-y-6 rounded-2xl p-4 md:p-6"
        data-theme={theme}
      >
        <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1.4fr)]">
          <FormSectionCard title="Datos principales">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Fecha" required error={touched.fecha ? errors.fecha : ""}>
                <input
                  type="date"
                  className={fieldControlClass({ error: touched.fecha && errors.fecha })}
                  value={form.fecha}
                  onChange={setField("fecha")}
                  onBlur={markTouched("fecha")}
                />
              </Field>

              <Field label="Dirección" required error={touched.kind ? errors.kind : ""}>
                <select
                  className={cx(
                    "neo-select",
                    fieldControlClass({ error: touched.kind && errors.kind })
                  )}
                  value={form.kind}
                  onChange={setField("kind")}
                  onBlur={markTouched("kind")}
                >
                  {KIND_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field
                label="Tipo de transacción"
                required
                error={touched.subtype ? errors.subtype : ""}
              >
                <select
                  className={cx(
                    "neo-select",
                    fieldControlClass({ error: touched.subtype && errors.subtype })
                  )}
                  value={form.subtype}
                  onChange={setField("subtype")}
                  onBlur={markTouched("subtype")}
                >
                  <option value="">Selecciona una opción</option>
                  {subtypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field
                label="Monto (USD)"
                required
                error={touched.monto ? errors.monto : ""}
                hint={!errors.monto ? "Debe ser mayor a 0." : ""}
              >
                <input
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                  className={fieldControlClass({ error: touched.monto && errors.monto })}
                  value={form.monto}
                  onChange={setField("monto")}
                  onBlur={markTouched("monto")}
                />
              </Field>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Negocio" hint="Pendiente: este combo vendrá desde la API de negocios.">
                <select
                  className={cx("neo-select", fieldControlClass())}
                  value={form.negocioId}
                  onChange={setField("negocioId")}
                >
                  <option value="">Pendiente API negocios</option>
                </select>
              </Field>

              <Field label="Propiedad / Unidad" hint="Temporal mientras integramos el selector real.">
                <input
                  className={fieldControlClass()}
                  placeholder="Ej. Propiedad 01 · Apto 3"
                  value={form.unidadId}
                  onChange={setField("unidadId")}
                />
              </Field>
            </div>

            <div className="mt-4">
              <Field
                label="Concepto"
                required
                error={touched.concepto ? errors.concepto : ""}
              >
                <textarea
                  rows={3}
                  className={cx(
                    "neo-textarea",
                    fieldControlClass({ error: touched.concepto && errors.concepto })
                  )}
                  placeholder="Ej. Avance de obra etapa 2, compra de equipo, venta día domingo, etc."
                  value={form.concepto}
                  onChange={setField("concepto")}
                  onBlur={markTouched("concepto")}
                />
              </Field>
            </div>
          </FormSectionCard>

          <div className="space-y-4">
            <FormSectionCard title="Origen del dinero y medio de pago">
              <Field label="Origen de los fondos">
                <select
                  className={cx("neo-select", fieldControlClass())}
                  value={form.origenFondos}
                  onChange={setField("origenFondos")}
                >
                  <option value="">Selecciona una opción</option>
                  {ORIGEN_FONDOS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </Field>

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <Field label="Medio de pago / cobro">
                  <input
                    className={fieldControlClass()}
                    placeholder="Transferencia, efectivo, tarjeta o cheque"
                    value={form.medioPago}
                    onChange={setField("medioPago")}
                  />
                </Field>

                <Field label="Referencia">
                  <input
                    className={fieldControlClass()}
                    placeholder="Comprobante o referencia bancaria"
                    value={form.referencia}
                    onChange={setField("referencia")}
                  />
                </Field>
              </div>
            </FormSectionCard>

            <FormSectionCard title="Campos avanzados">
              <p className="text-[11px] opacity-80">
                Aquí se agregarán <strong>campos opcionales del tipo</strong> y{" "}
                <strong>campos custom del negocio</strong>, por ejemplo arquitecto,
                lote, fase de obra, turno o caja.
              </p>
            </FormSectionCard>

            <FormSectionCard title="Notas internas">
              <Field label="Notas">
                <textarea
                  rows={3}
                  className={cx("neo-textarea", fieldControlClass())}
                  placeholder="Notas internas sobre esta transacción."
                  value={form.notas}
                  onChange={setField("notas")}
                />
              </Field>
            </FormSectionCard>
          </div>
        </div>

        <FormFooter
          onCancel={goBack}
          isSubmitting={saving}
          canSubmit={canSave}
          submitLabel={isEdit ? "Guardar cambios" : "Guardar transacción"}
          leftHint={!canSave ? "Completa: tipo, monto y concepto." : ""}
        />
      </form>
    </BaseFormPage>
  );
}
