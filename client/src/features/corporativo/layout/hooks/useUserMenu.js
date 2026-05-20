// client/src/features/corporativo/layout/hooks/useUserMenu.js
import { useEffect, useState } from "react";

export function useUserMenu() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    if (!userMenuOpen) return undefined;

    const handleDocumentMouseDown = (event) => {
      const menu = document.getElementById("user-menu-popover");
      const button = document.getElementById("user-menu-button");

      if (!menu || !button) return;

      if (!menu.contains(event.target) && !button.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleDocumentMouseDown);

    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, [userMenuOpen]);

  useEffect(() => {
    if (!userMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [userMenuOpen]);

  return {
    userMenuOpen,
    setUserMenuOpen,
  };
}
