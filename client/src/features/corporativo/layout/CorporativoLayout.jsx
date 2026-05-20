// client/src/features/corporativo/layout/CorporativoLayout.jsx
import React, { useCallback, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import toast from "react-hot-toast";

import { useTheme } from "@/core/theme/ThemeProvider.jsx";
import { useIdleLogout } from "@/core/utils/idleLogout";
import ConfirmModal from "@/core/ui/modals/ConfirmModal.jsx";

import { useAuthStore } from "@/features/auth/store/auth.store.js";

import ConfirmLogoutModal from "./components/ConfirmLogoutModal.jsx";
import CorporateFooter from "./components/CorporateFooter.jsx";
import CorporateTopbar from "./components/CorporateTopbar.jsx";
import CorporateWorkspace from "./components/CorporateWorkspace.jsx";
import { useCorporateNavigation } from "./hooks/useCorporateNavigation.js";

import "./CorporativoLayout.css";

export default function CorporativoLayout() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { theme } = useTheme();

    const logout = useAuthStore((state) => state.logout);

    const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
    const [confirmGoLoginOpen, setConfirmGoLoginOpen] = useState(false);

    const isNeo = theme?.startsWith("neo");

    const {
        user,
        visibleMainTabs,
        isFormRoute,
        mobileOpen,
        setMobileOpen,
        goLoginKeepAlive,
    } = useCorporateNavigation({ pathname, navigate });

    const mainBottomPadding = useMemo(
        () => (isFormRoute ? "pb-8" : "pb-20"),
        [isFormRoute]
    );

    useIdleLogout({
        timeoutMinutes: 10,
        onTimeout: () => {
            navigate("/login", {
                replace: true,
                state: { from: { pathname } },
            });
        },
    });

    const handleLogout = useCallback(async () => {
        try {
            await logout({ callBackend: true });
        } finally {
            window.__user = null;
            navigate("/login", { replace: true });
        }
    }, [logout, navigate]);

    const handleRequestGoLogin = useCallback(() => {
        setConfirmGoLoginOpen(true);
    }, []);

    const handleCancelGoLogin = useCallback(() => {
        setConfirmGoLoginOpen(false);
    }, []);

    const handleConfirmGoLogin = useCallback(() => {
        setConfirmGoLoginOpen(false);
        toast.success("Redirigiendo al login...");
        goLoginKeepAlive();
    }, [goLoginKeepAlive]);

    return (
        <div className="min-h-dvh bg-bg text-text flex flex-col">
            <a href="#contenido" className="corporate-skip-link">
                Saltar al contenido
            </a>

            <CorporateTopbar
                user={user}
                isNeo={isNeo}
                mobileOpen={mobileOpen}
                visibleMainTabs={visibleMainTabs}
                onToggleMobile={() => setMobileOpen((value) => !value)}
                onGoLogin={handleRequestGoLogin}
                onRequestLogout={() => setConfirmLogoutOpen(true)}
            />

            <main
                id="contenido"
                tabIndex={-1}
                className="flex-1 focus:outline-none overflow-y-auto overflow-x-hidden"
            >
                <div className={clsx("container-90 pt-6", mainBottomPadding)}>
                    <CorporateWorkspace>
                        <Outlet />
                    </CorporateWorkspace>
                </div>
            </main>

            <CorporateFooter
                user={user}
                isNeo={isNeo}
                isFormRoute={isFormRoute}
            />

            <ConfirmModal
                open={confirmGoLoginOpen}
                title="Ir a Login"
                message="Vas a volver a la pantalla de login sin cerrar la sesión actual. Esto permite cambiar o continuar con otro usuario activo. ¿Deseas continuar?"
                confirmText="Sí, ir a Login"
                cancelText="Cancelar"
                variant="default"
                onCancel={handleCancelGoLogin}
                onConfirm={handleConfirmGoLogin}
            />

            <ConfirmLogoutModal
                open={confirmLogoutOpen}
                onCancel={() => setConfirmLogoutOpen(false)}
                onConfirm={async () => {
                    setConfirmLogoutOpen(false);
                    await handleLogout();
                }}
            />
        </div>
    );
}
