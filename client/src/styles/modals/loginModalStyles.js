// client/src/styles/modals/loginModalStyles.js
export function getLoginModalOverride() {
    return {
        backdropClassName: "bg-black/70 backdrop-blur-sm",

        // Fondo oscuro + texto blanco
        cardClassName:
            "bg-[#050816]/95 text-white rounded-2xl px-8 py-6 " +
            "shadow-[0_0_40px_rgba(0,0,0,0.9)] border border-white/12",

        cancelButtonClassName:
            "bg-slate-700 hover:bg-slate-600 text-white rounded-lg px-4 py-2 " +
            "font-medium shadow",

        confirmButtonClassName:
            "bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 " +
            "font-semibold shadow-lg",

        titleClassName: "text-white",
        messageClassName: "text-white/90",
    };
}
