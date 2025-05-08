import { useEffect } from "react";
import { signIn, signOut } from "next-auth/react";

/**
 * Tự động đồng bộ session giữa các tab khi có refresh token hoặc logout.
 */
export function useSessionSyncAcrossTabs() {
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "refreshing" && event.newValue === null) {
        // Refresh token hoàn tất → gọi lại signIn("credentials") để cập nhật session
        console.log("[Session Sync] Refresh done, updating session...");
        signIn(undefined, { redirect: false }); // re-fetch session silently
      }

      if (event.key === "force-logout") {
        console.log("[Session Sync] Forced logout from another tab");
        signOut({ redirect: true });
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);
}

// Trigger logout từ 1 tab
export const forceLogoutAllTabs = () => {
  localStorage.setItem("force-logout", Date.now().toString());
  signOut();
};
