if (import.meta.env.DEV && !window.__user) {
  window.__user = {
    id: "owner-001",
    name: "Juan Flores",
    email: "juan@example.com",
    roles: ["owner"],                         // dueño: super
    permissions: ["users.manage"],           // redundante pero útil
    memberships: [{ role: "owner", scope: { type: "global" } }]
  };
  console.info("DEV __user inyectado:", window.__user);
}
