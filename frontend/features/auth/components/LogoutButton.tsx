import { logoutAsync } from "@/lib/redux/features/auth/authSlice";
import { useAppDispatch } from "@/lib/redux/hooks";
import React from "react";

type Props = {
  className?: string;
  onClickCb?: () => void;
};

const LogoutButton = ({ className, onClickCb }: Props) => {
  const dispatch = useAppDispatch();

  return (
    <button
      className={className}
      onClick={async () => {
        try {
          await dispatch(logoutAsync()).unwrap(); // Chờ logout thành công
          onClickCb && onClickCb(); // Chỉ chạy sau khi logout xong
        } catch (error) {
          console.error("Logout failed:", error);
        }
      }}
    >
      Logout
    </button>
  );
};

export default LogoutButton;
