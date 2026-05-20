// client/src/features/corporativo/layout/hooks/useCorporateNavigation.js
import { useCallback, useEffect, useMemo, useState } from "react";

import { MAIN_TABS } from "../constants/corporate-navigation.constants.js";
import {
  canSeeAccessTab,
  computeIsFormRoute,
  readRuntimeUser,
} from "../utils/corporate-layout.utils.js";

export function useCorporateNavigation({ pathname, navigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const user = useMemo(() => readRuntimeUser(), []);
  const isFormRoute = useMemo(() => computeIsFormRoute(pathname), [pathname]);

  const canManageUsers = useMemo(() => canSeeAccessTab(user.raw), [user.raw]);

  const visibleMainTabs = useMemo(() => {
    return MAIN_TABS.filter((item) => {
      if (item.to === "/corporativo/admin/users") {
        return canManageUsers;
      }

      return true;
    });
  }, [canManageUsers]);

  const goLoginKeepAlive = useCallback(() => {
    navigate("/login", { replace: true, state: { from: { pathname } } });
  }, [navigate, pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return {
    user,
    isFormRoute,
    mobileOpen,
    setMobileOpen,
    visibleMainTabs,
    goLoginKeepAlive,
  };
}

