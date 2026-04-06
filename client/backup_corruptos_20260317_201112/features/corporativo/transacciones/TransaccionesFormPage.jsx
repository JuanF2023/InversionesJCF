// client/src/features/corporativo/Transacciones/TransaccionesFormPage .jsx import React, {
useMemo , useState }
from "react" ;
import {
useNavigate, useParams }
from "React router dom" ;
import {
useTheme }
from " @ /context /ThemeContext.jsx" ;
import BaseFormPage from " @ /components/ui/layout/BaseFormPage.jsx" ;
import FormSectionCard from " @ /components/ui/layout/FormSectionCard.jsx" ;
import FormFooter from " @ /components/ui/layout/FormFooter.jsx" ;
import Field, {
fieldControlClass }
from " @ /components/ui/forms/Field.jsx" ;
const cx = ( . . .c)
= > c.filter(Boolean )
.join( " " )
;
// Direcci?n de flujo: ingreso vs costo const KIND_OPTIONS = [ {
value: "ingreso " , label: "Ingreso " }
, {
value: "costo" , label: "Costo" }
, ] ;
// Subtipo de transacci?n (se filtra por kind)
const SUBTYPE _OPTIONS = [ // Ingresos {
value: "venta_servicios" , label: "Ventas / servicios" , kind: "ingreso " }
, {
value: "renta" , label: "Renta / alquiler" , kind: "ingreso " }
, {
value: "otros_ingresos" , label: "Otros ingresos" , kind: "ingreso " }
, // Costos {
value: "liquidacion_obra" , label: "Liquidaci?n de obra / construcci?n " , kind: "costo" }
, {
value: "compra_propiedad" , label: "Compra de propiedad / terreno " , kind: "costo" }
, {
value: "costo_operativo" , label: "Costos operativos (restaurante, servicios, etc. )
" , kind: "costo" }
, {
value: "inversion_mejoras " , label: "Mejoras a inmuebles / CAPEX" , kind: "costo" }
, ] ;
// Origen del dinero const ORIGEN_FONDOS_OPTIONS = [ {
value: "aporte_propietario" , label: "Aporte propietario" }
, {
value: "inversion_externa " , label: "Inversi ?n externa " }
, {
value: "reinversion_negocio " , label: "Reinversi?n de utilidades" }
, {
value: "caja" , label: "Caja" }
, {
value: "banco" , label: "Banco" }
, ] ;
export default function TransaccionesFormPage ( )
{
const {
theme }
= useTheme( )
;
const navigate = useNavigate( )
;
const {
id }
= useParams( )
;
const isEdit = Boolean (id)
;
const [saving, setSaving] = useState(false)
;
const [form, setForm ] = useState( {
kind: "costo" , subtype : " " , fecha: new Date( )
.toISOString( )
.slice( 0 , 1 0 )
, negocioId: " " , propiedadId: " " , unidadId: " " , monto: " " , concepto: " " , origenFondos: " " , medioPago: " " , referencia: " " , notas: " " , }
)
;
const [touched , setTouched] = useState( {
}
)
;
const [errors, setErrors] = useState( {
}
)
;
const subtypeOptions = useMemo ( ( )
= > SUBTYPE _OPTIONS .filter( (s)
= > s.kind = = = form.kind)
, [form.kind] )
;
const setField = (field)
= > (e)
= > {
const value = e? .target? .value ? ? " " ;
setForm ( (prev)
= > ( {
. . .prev, [field] : value }
)
)
;
}
;
const markTouched = (field)
= > ( )
= > {
setTouched( (prev)
= > ( {
. . .prev, [field] : true }
)
)
;
}
;
const goBack = ( )
= > navigate( 1 )
;
const validate = (nextForm = form)
= > {
const next = {
}
;
if ( !nextForm.fecha)
next.fecha = "Selecciona la fecha. " ;
if ( !nextForm.kind)
next.kind = "Selecciona la direcci ?n . " ;
if ( !nextForm.subtype )
next.subtype = "Selecciona el tipo de transacci?n . " ;
const montoNum = Number(nextForm.monto)
;
if ( !nextForm.monto | | Number.isNaN(montoNum)
| | montoNum < = 0 )
{
next.monto = "Ingresa un monto mayor a 0 . " ;
}
if ( !nextForm.concepto? .trim( )
| | nextForm.concepto.trim( )
.length < 3 )
{
next.concepto = "Ingresa un concepto (m?nimo 3 caracteres)
. " ;
}
setErrors(next)
;
return Object.keys(next)
.length = = = 0 ;
}
;
const canSave = useMemo ( ( )
= > validate(form)
, [form] )
;
// validaci?n reactiva const handleSubmit = async (e)
= > {
e.preventdefault ( )
;
// marcar campos clave como tocados para mostrar errores si faltan setTouched( (prev)
= > ( {
. . .prev, fecha: true, kind: true, subtype : true, monto: true, concepto: true, }
)
)
;
if ( !validate(form)
)
return;
const payload = {
. . .form, id: id | | null, monto: Number(form.monto | | 0 )
, }
;
try {
setSaving(true)
;
console .log( isEdit ? " [TransaccionesFormPage ] Editar transacci?n ??payload : " : " [TransaccionesFormPage ] Crear transacci?n ??payload : " , payload )
;
// TODO: // POST /transacciones cuando !isEdit // PUT /transacciones/ :id cuando isEdit if (window? .toast? .success )
{
window.toast.success (isEdit ? "Transacci?n actualizada (demo)
" : "Transacci?n registrada (demo)
" )
;
}
else {
alert(isEdit ? "Transacci?n actualizada (demo)
. Falta integrar API. " : "Transacci?n registrada (demo)
. Falta integrar API. " )
;
}
goBack( )
;
}
catch (err)
{
console .error(err)
;
if (window? .toast? .error)
window.toast.error( "No se pudo guardar la transacci?n " )
;
else alert( "No se pudo guardar la transacci?n " )
;
}
finally {
setSaving(false)
;
}
}
;
const title = isEdit ? "Editar transacci?n " : "Agregar transacci?n " ;
const description = isEdit ? "Actualiza esta transacci?n . Afecta indicadores, reportes y paneles del corporativo. " : "Registra ingresos y costos de cualquier negocio , proyecto o propiedad. Esta informaci?n alimenta indicadores, reportes y paneles del corporativo. " ;
return ( <BaseFormPage title= {title}
description= {description}
onBack= {goBack}
> <form onSubmit= {handleSubmit}
className= {cx( "neo card neo card deep neo card tinted no clip w full rounded 2xl p 4 md:p 6 spacey 6 " )
}
data theme= {theme}
> <div className= "grid grid cols 1 lg:grid cols [minmax( 0 , 1 . 8fr)
_minmax( 0 , 1 . 4fr)
] gap 4 w full" > {
/ * IZQUIERDA * / }
<FormSectionCard title= "Datos principales (campos est?ndar)
" > <div className= "grid gap 4 md:grid cols 2 " > <Field label= "Fecha" required error= {touched .fecha ? errors.fecha : " " }
> <input type= "date" className= {fieldControlClass( {
error: touched .fecha & & errors.fecha }
)
}
value= {form.fecha}
onChange= {setField( "fecha" )
}
onBlur= {markTouched( "fecha" )
}
/ > < /Field> <Field label= "Direcci ?n " required error= {touched .kind ? errors.kind : " " }
> <select className= {cx( "neo select" , fieldControlClass( {
error: touched .kind & & errors.kind }
)
)
}
value= {form.kind}
onChange= {setField( "kind" )
}
onBlur= {markTouched( "kind" )
}
> {KIND_OPTIONS .map( (k)
= > ( <option key= {k.value}
value= {k.value}
> {k.label}
< /option> )
)
}
< /select> < /Field> < /div> <div className= "grid gap 4 md:grid cols 2 mt 4 " > <Field label= "Tipo de transacci?n " required error= {touched .subtype ? errors.subtype : " " }
> <select className= {cx( "neo select" , fieldControlClass( {
error: touched .subtype & & errors.subtype }
)
)
}
value= {form.subtype }
onChange= {setField( "subtype " )
}
onBlur= {markTouched( "subtype " )
}
> <option value= " " >Selecciona?? /option> {subtypeOptions .map( (s)
= > ( <option key= {s.value}
value= {s.value}
> {s.label}
< /option> )
)
}
< /select> < /Field> <Field label= "Monto (USD)
" required error= {touched .monto ? errors.monto : " " }
hint= {
!errors.monto ? "Debe ser mayor a 0 . " : " " }
> <input type= "number" inputMode= "decimal " placeholder= " 0 . 0 0 " className= {fieldControlClass( {
error: touched .monto & & errors.monto }
)
}
value= {form.monto}
onChange= {setField( "monto" )
}
onBlur= {markTouched( "monto" )
}
/ > < /Field> < /div> <div className= "grid gap 4 md:grid cols 2 mt 4 " > <Field label= "Negocio " hint= "Pendiente: este combo vendr? desde la API de negocios. " > <select className= {cx( "neo select" , fieldControlClass( )
)
}
value= {form.negocioId}
onChange= {setField( "negocioId" )
}
> <option value= " " > (Pendiente API negocios)
< /option> < /select> < /Field> <Field label= "Propiedad / Unidad" hint= "Puedes usar un texto temporal mientras integramos el selector real. " > <input className= {fieldControlClass( )
}
placeholder= "Ej. Propiedad 0 1 ? Apto 3 " value= {form.unidadId}
onChange= {setField( "unidadId" )
}
/ > < /Field> < /div> <div className= "mt 4 " > <Field label= "Concepto" required error= {touched .concepto ? errors.concepto : " " }
> <textarea rows= {
3 }
className= {cx( "neo textarea" , fieldControlClass( {
error: touched .concepto & & errors.concepto }
)
)
}
placeholder= "Ej. Avance de obra etapa 2 , compra de equipo, venta d?a domingo , etc. " value= {form.concepto}
onChange= {setField( "concepto" )
}
onBlur= {markTouched( "concepto" )
}
/ > < /Field> < /div> < /FormSectionCard> {
/ * DERECHA * / }
<div className= "spacey 4 " > <FormSectionCard title= "Origen del dinero y medio de pago" > <Field label= "Origen de los fondos" > <select className= {cx( "neo select" , fieldControlClass( )
)
}
value= {form.origenFondos}
onChange= {setField( "origenFondos" )
}
> <option value= " " >Selecciona?? /option> {ORIGEN_FONDOS_OPTIONS .map( (o)
= > ( <option key= {o.value}
value= {o.value}
> {o.label}
< /option> )
)
}
< /select> < /Field> <div className= "grid gap 4 md:grid cols 2 mt 4 " > <Field label= "Medio de pago / cobro" > <input className= {fieldControlClass( )
}
placeholder= "Transferencia, efectivo, tarjeta , cheque?? value= {form.medioPago}
onChange= {setField( "medioPago" )
}
/ > < /Field> <Field label= "Referencia" > <input className= {fieldControlClass( )
}
placeholder= "No. de comprobante, referencia bancaria, etc. " value= {form.referencia}
onChange= {setField( "referencia" )
}
/ > < /Field> < /div> < /FormSectionCard> <FormSectionCard title= "Campos avanzados" > <p className= "text [ 1 1px] opacity 8 0 " > Aqu? se agregar ?n <strong>campos opcionales del tipo< /strong> y{
" " }
<strong>campos custom del negocio < /strong> (por ejemplo , arquitecto, lote, fase de obra, turno, caja, etc. )
. Por ahora es solo un placeholder para no romper el dise鐢?o . < /p> < /FormSectionCard> <FormSectionCard title= "Notas internas" > <Field label= "Notas" > <textarea rows= {
3 }
className= {cx( "neo textarea" , fieldControlClass( )
)
}
placeholder= "Notas internas sobre esta transacci?n (no se muestran al cliente )
. " value= {form.notas}
onChange= {setField( "notas" )
}
/ > < /Field> < /FormSectionCard> < /div> < /div> <FormFooter onCancel= {goBack}
isSubmitting= {saving}
canSubmit= {canSave }
submitLabel= {isEdit ? "Guardar cambios " : "Guardar transacci?n " }
leftHint= {
!canSave ? "Completa: Tipo, Monto y Concepto (m?n . 3 caracteres)
. " : " " }
/ > < /form> < /BaseFormPage> )
;
}