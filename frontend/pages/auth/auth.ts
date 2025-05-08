import jwt from "jsonwebtoken";

let refreshing: Promise<any> | null = null;
export async function refreshAccessToken(token: any) {
  // Nếu đang có request refresh → dùng lại promise đó
  if (refreshing) return refreshing;

  // Lưu trạng thái refresh vào localStorage để các tab khác biết
  if (typeof window !== "undefined") {
    localStorage.setItem("refreshing", "true");
  }

  refreshing = (async () => {
    console.log("====================");
    console.log("refreshAccessToken");
    console.log("====================");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/v1/auth/refresh`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token.refreshToken}`,
          },
          body: JSON.stringify({ refreshToken: token.refreshToken }),
        },
      );

      if (!res.ok) {
        const text = await res.json(); // hoặc res.json() nếu chắc chắn trả về JSON
        console.error("Failed to refresh token. Response:", text);
        throw new Error("Failed to refresh token");
      }

      const data = await res.json();
      const payload = jwt.decode(data.accessToken) as jwt.JwtPayload | null;

      token = {
        ...token,
        ...data,
        payload,
        refreshToken: data.refreshToken ?? token.refreshToken,
        accessTokenExpires: payload?.exp
          ? payload.exp * 1000
          : Date.now() + 10 * 60 * 1000,
      };

      return token;
    } catch (error) {
      console.error("Error refreshing access token", error);

      // Force logout by clearing the session
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    } finally {
      refreshing = null;
      if (typeof window !== "undefined") {
        localStorage.removeItem("refreshing");
      }
    }
  })();
  return refreshing;
}
