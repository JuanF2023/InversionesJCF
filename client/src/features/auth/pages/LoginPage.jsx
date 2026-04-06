// client/src/features/auth/pages/LoginPage.jsx
import React from "react";

import LoginHeader from "@/features/auth/components/LoginHeader.jsx";
import PinIndicators from "@/features/auth/components/PinIndicators.jsx";
import PinPad from "@/features/auth/components/PinPad.jsx";
import LoginActions from "@/features/auth/components/LoginActions.jsx";
import ActiveUsersPanel from "@/features/auth/components/ActiveUsersPanel.jsx";
import TenantPickerModal from "@/features/auth/modals/TenantPickerModal.jsx";
import LogoutConfirmModal from "@/features/auth/modals/LogoutConfirmModal.jsx";
import { useLoginFlow } from "@/features/auth/hooks/useLoginFlow.js";

const ALLOWED_PIN_LENGTHS = [4, 6];
const MAX_PIN = 6;

export default function LoginPage() {
  const {
    pin,
    loadingUi,
    onBreak,
    logoutModalOpen,
    logoutLoading,
    tenantModalOpen,
    tenantOptions,
    selectedTenantId,
    active,
    todayText,
    canContinue,
    canAttempt,
    sessionConflictMessage,
    pushDigit,
    handleClear,
    handleBackspace,
    handleEntrar,
    handleContinue,
    handleReceso,
    openLogoutModal,
    closeLogoutModal,
    confirmLogout,
    onPickTenant,
    closeTenantModal,
  } = useLoginFlow({
    allowedPinLengths: ALLOWED_PIN_LENGTHS,
    maxPin: MAX_PIN,
  });

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#12284a_0%,_#0b1730_45%,_#08111f_100%)] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-5xl rounded-[28px] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <div className="grid grid-cols-1 gap-8 p-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="space-y-6">
            <LoginHeader
              title="Inversiones JCF"
              subtitle={todayText}
              description="Accede con tu PIN para entrar, continuar una sesión activa o registrar tus acciones operativas."
            />

            <PinIndicators pinLength={pin.length} maxPin={MAX_PIN} />

            {sessionConflictMessage ? (
              <div className="rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100 shadow-sm">
                {sessionConflictMessage}
              </div>
            ) : null}

            <PinPad
              onDigit={pushDigit}
              onClear={handleClear}
              onBackspace={handleBackspace}
              disabled={loadingUi}
            />

            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className="w-full rounded-2xl bg-emerald-600 px-5 py-4 text-lg font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuar
            </button>
          </section>

          <section className="space-y-5">
            <ActiveUsersPanel active={active} />

            <LoginActions
              canAttempt={canAttempt}
              loadingUi={loadingUi}
              onEntrar={handleEntrar}
              onReceso={handleReceso}
              onSalir={openLogoutModal}
              onBreak={onBreak}
            />
          </section>
        </div>
      </div>

      <TenantPickerModal
        open={tenantModalOpen}
        tenants={tenantOptions}
        selectedTenantId={selectedTenantId}
        onSelect={onPickTenant}
        onClose={closeTenantModal}
      />

      <LogoutConfirmModal
        open={logoutModalOpen}
        loading={logoutLoading}
        onClose={closeLogoutModal}
        onConfirm={confirmLogout}
      />
    </div>
  );
}