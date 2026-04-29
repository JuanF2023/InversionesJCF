// client/src/app/App.jsx
import React, { Suspense, lazy, useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import ProtectedRoute from "@/core/security/ProtectedRoute.jsx";
import SessionWatcher from "@/core/security/SessionWatcher.jsx";

import {
  loadSession,
  isTokenValid,
  clearSession,
} from "@/core/utils/authSession.js";
import { useAuthStore } from "@/features/auth/store/auth.store.js";

/* ---------- Fallbacks ---------- */
const Fallback = () => (
  <div className="grid min-h-[40vh] place-items-center p-8">
    <div className="w-full max-w-4xl space-y-4">
      <div className="h-8 w-56 animate-pulse rounded-xl bg-[color-mix(in_srgb,var(--panel)_85%,var(--text)_15%)]" />
      <div className="h-4 w-80 animate-pulse rounded-md bg-[color-mix(in_srgb,var(--panel)_85%,var(--text)_15%)]" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((key) => (
          <div
            key={key}
            className="h-40 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--panel)] shadow-sm"
          >
            <div className="h-full w-full animate-pulse bg-[color-mix(in_srgb,var(--panel)_80%,var(--text)_10%)]" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const RouteError = () => (
  <div className="grid min-h-[50vh] place-items-center p-8">
    <div className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-xl">
      <h2 className="mb-2 text-xl font-semibold">Ocurrió un problema</h2>
      <p className="text-sm opacity-80">Intenta refrescar o volver atrás.</p>
    </div>
  </div>
);

const NotFound = () => (
  <div className="grid min-h-[50vh] place-items-center p-8">
    <div className="w-full max-w-xl rounded-2xl border border-[var(--border)] bg-[var(--panel)] p-6 shadow-xl">
      <h1 className="mb-1 text-2xl font-semibold">404</h1>
      <p className="opacity-80">La ruta que buscas no existe.</p>

      <div className="mt-4">
        <a
          href="/login"
          className="rounded-xl border border-[var(--border)] px-4 py-2"
        >
          Ir al login
        </a>
      </div>
    </div>
  </div>
);

/* ---------- Router shell ---------- */
function RouterShell() {
  return (
    <>
      <SessionWatcher />
      <Outlet />
    </>
  );
}

/* ---------- Lazy pages ---------- */
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage.jsx"));

const CorporativoLayout = lazy(() =>
  import("@/features/corporativo/layout/CorporativoLayout.jsx")
);

/* Dashboards */
const DashboardsLayout = lazy(() =>
  import("@/features/corporativo/dashboards/components/DashboardsLayout.jsx")
);
const PanelNegocios = lazy(() =>
  import("@/features/corporativo/dashboards/components/PanelNegocios.jsx")
);
const PanelPropiedades = lazy(() =>
  import("@/features/corporativo/dashboards/components/PanelPropiedades.jsx")
);
const PanelProyectos = lazy(() =>
  import("@/features/corporativo/dashboards/components/PanelProyectos.jsx")
);
const PanelTransacciones = lazy(() =>
  import("@/features/corporativo/dashboards/components/PanelTransacciones.jsx")
);
const PanelIndicadores = lazy(() =>
  import("@/features/corporativo/dashboards/components/PanelIndicadores.jsx")
);
const PanelInformes = lazy(() =>
  import("@/features/corporativo/dashboards/components/PanelInformes.jsx")
);

const GeneralesPage = lazy(() =>
  import("@/features/corporativo/dashboards/pages/GeneralesPage.jsx")
);
const PorHacerPage = lazy(() =>
  import("@/features/corporativo/dashboards/pages/PorHacerPage.jsx")
);
const AcercaDePage = lazy(() =>
  import("@/features/corporativo/dashboards/pages/AcercaDePage.jsx")
);
const FilosofiaDeDarPage = lazy(() =>
  import("@/features/corporativo/dashboards/pages/FilosofiaDeDarPage.jsx")
);
const PanelNegociosPage = lazy(() =>
  import("@/features/corporativo/dashboards/pages/PanelNegociosPage.jsx")
);

/* Negocios */
const NegociosLayout = lazy(() =>
  import("@/features/corporativo/negocios/components/NegociosLayout.jsx")
);
const NegociosResumenPage = lazy(() =>
  import("@/features/corporativo/negocios/pages/NegociosResumenPage.jsx")
);
const NegociosOperacionPage = lazy(() =>
  import("@/features/corporativo/negocios/pages/NegociosOperacionPage.jsx")
);
const NegociosFinanzasPage = lazy(() =>
  import("@/features/corporativo/negocios/pages/NegociosFinanzasPage.jsx")
);
const NegociosUnidadesPage = lazy(() =>
  import("@/features/corporativo/negocios/pages/NegociosUnidadesPage.jsx")
);
const NegociosConfiguracionPage = lazy(() =>
  import("@/features/corporativo/negocios/pages/NegociosConfiguracionPage.jsx")
);
const BusinessFormPage = lazy(() =>
  import("@/features/corporativo/negocios/pages/BusinessFormPage.jsx")
);

const BusinessLayout = lazy(() =>
  import("@/features/corporativo/negocios/components/business-detail/BusinessLayout.jsx")
);
const BusinessOverview = lazy(() =>
  import("@/features/corporativo/negocios/components/business-detail/BusinessOverview.jsx")
);

/* Propiedades */
const PropiedadesLayout = lazy(() =>
  import("@/features/corporativo/propiedades/pages/PropiedadesLayout.jsx")
);
const PropiedadesPanel = lazy(() =>
  import("@/features/corporativo/propiedades/pages/PropiedadesPanel.jsx")
);
const PropiedadesReportes = lazy(() =>
  import("@/features/corporativo/propiedades/pages/PropiedadesReportes.jsx")
);
const PropiedadesFormPage = lazy(() =>
  import("@/features/corporativo/propiedades/pages/PropiedadesFormPage.jsx")
);
const PropiedadesIndex = lazy(() =>
  import("@/features/corporativo/propiedades/pages/PropiedadesIndex.jsx")
);
const PropiedadesIngresos = lazy(() =>
  import("@/features/corporativo/propiedades/pages/PropiedadesIngresos.jsx")
);

const DetallesLayout = lazy(() =>
  import("@/features/corporativo/propiedades/components/detalles/DetallesLayout.jsx")
);
const DetallesDatosProp = lazy(() =>
  import("@/features/corporativo/propiedades/components/detalles/DetallesDatosProp.jsx")
);
const DetallesProyectosProp = lazy(() =>
  import("@/features/corporativo/propiedades/components/detalles/DetallesProyectosProp.jsx")
);
const DetallesIngresosProp = lazy(() =>
  import("@/features/corporativo/propiedades/components/detalles/DetallesIngresosProp.jsx")
);
const DetallesNegociosProp = lazy(() =>
  import("@/features/corporativo/propiedades/components/detalles/DetallesNegociosProp.jsx")
);
const DetallesUnidadesProp = lazy(() =>
  import("@/features/corporativo/propiedades/components/detalles/DetallesUnidadesProp.jsx")
);
const DetallesHistorialProp = lazy(() =>
  import("@/features/corporativo/propiedades/components/detalles/DetallesHistorialProp.jsx")
);

const UnidadesLayout = lazy(() =>
  import("@/features/corporativo/propiedades/components/unidades/UnidadesLayout.jsx")
);
const UnidadesListPage = lazy(() =>
  import("@/features/corporativo/propiedades/pages/UnidadesListPage.jsx")
);
const UnidadesForm = lazy(() =>
  import("@/features/corporativo/propiedades/components/unidades/UnidadesForm.jsx")
);
const UnidadesMapaPage = lazy(() =>
  import("@/features/corporativo/propiedades/pages/UnidadesMapaPage.jsx")
);
const UnidadesOcupacionPage = lazy(() =>
  import("@/features/corporativo/propiedades/pages/UnidadesOcupacionPage.jsx")
);

/* Proyectos */
const ProyectosLayout = lazy(() =>
  import("@/features/corporativo/proyectos/pages/ProyectosLayout.jsx")
);
const ProyectosListPage = lazy(() =>
  import("@/features/corporativo/proyectos/pages/ProyectosListPage.jsx")
);
const ProyectosDetailsPage = lazy(() =>
  import("@/features/corporativo/proyectos/pages/ProyectosDetailsPage.jsx")
);
const ProyectosFormPage = lazy(() =>
  import("@/features/corporativo/proyectos/pages/ProyectosFormPage.jsx")
);

/* Transacciones */
const TransaccionesLayout = lazy(() =>
  import("@/features/corporativo/transacciones/pages/TransaccionesLayout.jsx")
);
const TransaccionesListPage = lazy(() =>
  import("@/features/corporativo/transacciones/pages/TransaccionesListPage.jsx")
);
const TransaccionesReportesPage = lazy(() =>
  import("@/features/corporativo/transacciones/pages/TransaccionesReportesPage.jsx")
);
const TransaccionesFormPage = lazy(() =>
  import("@/features/corporativo/transacciones/pages/TransaccionesFormPage.jsx")
);

/* Indicadores */
const IndicadoresLayout = lazy(() =>
  import("@/features/corporativo/indicadores/pages/IndicadoresLayout.jsx")
);
const IndicadoresPanelPage = lazy(() =>
  import("@/features/corporativo/indicadores/pages/IndicadoresPanelPage.jsx")
);
const IndicadoresComparativosPage = lazy(() =>
  import("@/features/corporativo/indicadores/pages/IndicadoresComparativosPage.jsx")
);
const IndicadoresProyeccionesPage = lazy(() =>
  import("@/features/corporativo/indicadores/pages/IndicadoresProyeccionesPage.jsx")
);

/* Informes */
const InformesLayout = lazy(() =>
  import("@/features/corporativo/informes/pages/InformesLayout.jsx")
);
const InformesResumenPage = lazy(() =>
  import("@/features/corporativo/informes/pages/InformesResumenPage.jsx")
);
const InformesTablasPage = lazy(() =>
  import("@/features/corporativo/informes/pages/InformesTablasPage.jsx")
);
const InformesExportarPage = lazy(() =>
  import("@/features/corporativo/informes/pages/InformesExportarPage.jsx")
);

/* Accesos */
const AccessLayout = lazy(() =>
  import("@/features/corporativo/access/components/layout/AccessLayout.jsx")
);
const UsersPage = lazy(() =>
  import("@/features/corporativo/access/pages/UsersPage.jsx")
);
const RolesPage = lazy(() =>
  import("@/features/corporativo/access/pages/RolesPage.jsx")
);
const PermissionsPage = lazy(() =>
  import("@/features/corporativo/access/pages/PermissionsPage.jsx")
);
const UserCreatePage = lazy(() =>
  import("@/features/corporativo/access/pages/UserCreatePage.jsx")
);
const UserEditPage = lazy(() =>
  import("@/features/corporativo/access/pages/UserEditPage.jsx")
);
const UserDetailPage = lazy(() =>
  import("@/features/corporativo/access/pages/UserDetailPage.jsx")
);

/* ---------- Helpers ---------- */
const withSuspense = (element) => (
  <Suspense fallback={<Fallback />}>{element}</Suspense>
);

const withProtected = (element) => <ProtectedRoute>{element}</ProtectedRoute>;

function hasValidPersistedSession() {
  const session = loadSession() || {};
  const token = typeof session?.token === "string" ? session.token.trim() : "";

  return Boolean(token && isTokenValid(token));
}

/* ---------- Router ---------- */
const router = createBrowserRouter([
  {
    path: "/",
    element: <RouterShell />,
    errorElement: <RouteError />,
    children: [
      {
        index: true,
        element: (
          <Navigate
            to={hasValidPersistedSession() ? "/corporativo" : "/login"}
            replace
          />
        ),
      },
      {
        path: "login",
        element: withSuspense(<LoginPage />),
        errorElement: <RouteError />,
      },
      {
        path: "corporativo",
        element: withSuspense(withProtected(<CorporativoLayout />)),
        errorElement: <RouteError />,
        children: [
          { index: true, element: <Navigate to="dashboards/negocios" replace /> },
          {
            path: "dashboards",
            element: withSuspense(<DashboardsLayout />),
            children: [
              { index: true, element: <Navigate to="negocios" replace /> },
              { path: "negocios", element: withSuspense(<PanelNegocios />) },
              { path: "propiedades", element: withSuspense(<PanelPropiedades />) },
              { path: "proyectos", element: withSuspense(<PanelProyectos />) },
              { path: "transacciones", element: withSuspense(<PanelTransacciones />) },
              { path: "indicadores", element: withSuspense(<PanelIndicadores />) },
              { path: "informes", element: withSuspense(<PanelInformes />) },
            ],
          },
          {
            path: "negocios",
            element: withSuspense(<NegociosLayout />),
            errorElement: <RouteError />,
            children: [
              { index: true, element: <Navigate to="resumen" replace /> },
              { path: "resumen", element: withSuspense(<NegociosResumenPage />) },
              { path: "operacion", element: withSuspense(<NegociosOperacionPage />) },
              { path: "finanzas", element: withSuspense(<NegociosFinanzasPage />) },
              { path: "unidades", element: withSuspense(<NegociosUnidadesPage />) },
              { path: "configuracion", element: withSuspense(<NegociosConfiguracionPage />) },
              { path: "nuevo", element: withSuspense(<BusinessFormPage />) },
              { path: ":businessId/editar", element: withSuspense(<BusinessFormPage />) },
              {
                path: ":businessId",
                element: withSuspense(<BusinessLayout />),
                children: [
                  { index: true, element: withSuspense(<BusinessOverview />) },
                  { path: "transacciones", element: withSuspense(<BusinessOverview />) },
                  { path: "bancos", element: withSuspense(<BusinessOverview />) },
                  { path: "config", element: withSuspense(<BusinessOverview />) },
                ],
              },
            ],
          },
          {
            path: "propiedades",
            element: withSuspense(<PropiedadesLayout />),
            errorElement: <RouteError />,
            children: [
              { index: true, element: <Navigate to="panel" replace /> },
              { path: "panel", element: withSuspense(<PropiedadesPanel />) },
              { path: "reportes", element: withSuspense(<PropiedadesReportes />) },
              { path: "index", element: withSuspense(<PropiedadesIndex />) },
              { path: "ingresos", element: withSuspense(<PropiedadesIngresos />) },
              { path: "crear", element: withSuspense(<PropiedadesFormPage />) },
              { path: ":id/editar", element: withSuspense(<PropiedadesFormPage />) },
              {
                path: "detalles",
                element: withSuspense(<DetallesLayout />),
                children: [
                  {
                    index: true,
                    element: (
                      <div className="subtle rounded-xl border border-[var(--border)] bg-[var(--panel)] p-3 text-sm">
                        Selecciona una propiedad y una sección.
                      </div>
                    ),
                  },
                  { path: "datos", element: withSuspense(<DetallesDatosProp />) },
                  { path: "proyectos", element: withSuspense(<DetallesProyectosProp />) },
                  { path: "ingresos", element: withSuspense(<DetallesIngresosProp />) },
                  { path: "negocios", element: withSuspense(<DetallesNegociosProp />) },
                  { path: "unidades", element: withSuspense(<DetallesUnidadesProp />) },
                  { path: "historial", element: withSuspense(<DetallesHistorialProp />) },
                ],
              },
              {
                path: "unidades",
                element: withSuspense(<UnidadesLayout />),
                children: [
                  { index: true, element: <Navigate to="lista" replace /> },
                  { path: "lista", element: withSuspense(<UnidadesListPage />) },
                  { path: "ocupacion", element: withSuspense(<UnidadesOcupacionPage />) },
                  { path: "mapa", element: withSuspense(<UnidadesMapaPage />) },
                  { path: "nueva", element: withSuspense(<UnidadesForm mode="create" />) },
                  { path: ":id/editar", element: withSuspense(<UnidadesForm mode="edit" />) },
                ],
              },
            ],
          },
          {
            path: "proyectos",
            element: withSuspense(<ProyectosLayout />),
            errorElement: <RouteError />,
            children: [
              { index: true, element: <Navigate to="lista" replace /> },
              { path: "lista", element: withSuspense(<ProyectosListPage />) },
              { path: "nuevo", element: withSuspense(<ProyectosFormPage />) },
              { path: ":id/editar", element: withSuspense(<ProyectosFormPage />) },
              { path: ":id", element: withSuspense(<ProyectosDetailsPage />) },
            ],
          },
          {
            path: "indicadores",
            element: withSuspense(<IndicadoresLayout />),
            errorElement: <RouteError />,
            children: [
              { index: true, element: <Navigate to="panel" replace /> },
              { path: "panel", element: withSuspense(<IndicadoresPanelPage />) },
              { path: "comparativos", element: withSuspense(<IndicadoresComparativosPage />) },
              { path: "proyecciones", element: withSuspense(<IndicadoresProyeccionesPage />) },
            ],
          },
          {
            path: "informes",
            element: withSuspense(<InformesLayout />),
            errorElement: <RouteError />,
            children: [
              { index: true, element: <Navigate to="resumen" replace /> },
              { path: "resumen", element: withSuspense(<InformesResumenPage />) },
              { path: "tablas", element: withSuspense(<InformesTablasPage />) },
              { path: "exportar", element: withSuspense(<InformesExportarPage />) },
            ],
          },
          {
            path: "transacciones",
            element: withSuspense(<TransaccionesLayout />),
            errorElement: <RouteError />,
            children: [
              { index: true, element: <Navigate to="lista" replace /> },
              { path: "lista", element: withSuspense(<TransaccionesListPage />) },
              { path: "nueva", element: withSuspense(<TransaccionesFormPage />) },
              { path: ":id/editar", element: withSuspense(<TransaccionesFormPage />) },
              { path: "reportes", element: withSuspense(<TransaccionesReportesPage />) },
            ],
          },
          { path: "generales", element: withSuspense(<GeneralesPage />) },
          { path: "por-hacer", element: withSuspense(<PorHacerPage />) },
          { path: "acerca-de", element: withSuspense(<AcercaDePage />) },
          { path: "filosofia-de-dar", element: withSuspense(<FilosofiaDeDarPage />) },
          { path: "panel-negocios-page", element: withSuspense(<PanelNegociosPage />) },
          {
            path: "admin/users",
            element: withSuspense(<AccessLayout />),
            errorElement: <RouteError />,
            children: [
              { index: true, element: withSuspense(<UsersPage />) },
              { path: "roles", element: withSuspense(<RolesPage />) },
              { path: "permisos", element: withSuspense(<PermissionsPage />) },
              { path: "nuevo", element: withSuspense(<UserCreatePage />) },
              { path: ":userId/editar", element: withSuspense(<UserEditPage />) },
              { path: ":userId", element: withSuspense(<UserDetailPage />) },
            ],
          },
          { path: "*", element: <Navigate to="dashboards/negocios" replace /> },
        ],
      },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

/* ---------- Root App ---------- */
export default function App() {
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    const session = loadSession() || {};
    const token = typeof session?.token === "string" ? session.token.trim() : "";

    if (token && !isTokenValid(token)) {
      clearSession();
      window.location.replace("/login");
      return;
    }

    hydrate();
  }, [hydrate]);

  return (
    <>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          className: "neo-toast",
          style: {
            background: "var(--panel)",
            color: "var(--text)",
            border: "1px solid var(--border)",
            boxShadow: "0 10px 30px rgba(0,0,0,.15)",
          },
        }}
      />
    </>
  );
}
