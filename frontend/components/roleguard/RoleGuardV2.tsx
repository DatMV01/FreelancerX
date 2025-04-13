import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import type { AppProps } from "next/app";
import { useEffect } from "react";

const roleProtectedRoutes = {
  admin: ["/admin", "/admin/users"],
  freelancer: ["/freelancer", "/freelancer/orders"],
};

function RoleGuard({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { role } = useSelector((state: any) => state.user);

  useEffect(() => {
    const path = router.pathname;
    const restricted = Object.entries(roleProtectedRoutes).some(
      ([requiredRole, paths]) => {
        if (paths.includes(path)) {
          return role !== requiredRole;
        }
        return false;
      },
    );

    if (restricted) {
      router.replace("/login"); // hoặc redirect theo logic riêng
    }
  }, [router.pathname, role]);

  return <Component {...pageProps} />;
}

// Use
// export default function MyApp(props: AppProps) {
//   return (
//     <Provider store={store}>
//       <RoleGuard {...props} />
//     </Provider>
//   );
// }
