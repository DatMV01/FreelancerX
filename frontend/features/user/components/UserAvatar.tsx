"use client";

import useGetUserInfo from "@/hooks/useGetUserInfo";
import { stringAvatar } from "@/lib/utils";
import { Avatar, Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import { ReactNode } from "react";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": { transform: "scale(.8)", opacity: 1 },
    "100%": { transform: "scale(2.4)", opacity: 0 },
  },
}));

const MyAvatar = ({ avatarUrl, fontSize, height, width, children }: {
  avatarUrl?: string;
  fontSize?: number;
  height?: number;
  width?: number;
  children?: ReactNode;
}) => (
  <Avatar sx={{ height, width, fontSize }} alt="Avatar" src={avatarUrl}>
    {children}
  </Avatar>
);

const UserAvatar = ({
  avatarUrl,
  fontSize,
  fullName,
  showBadge = false,
  height,
  width,
}: {
  avatarUrl?: string;
  fontSize?: number;
  fullName?: string;
  showBadge?: boolean;
  height?: number;
  width?: number;
}) => {
  const { user } = useGetUserInfo();
  const finalAvatar = avatarUrl || user?.avatar;
  const displayName = fullName || user?.fullName;
  
  const avatarComponent = (
    <MyAvatar avatarUrl={finalAvatar} height={height} width={width} fontSize={fontSize}>
      {!finalAvatar && displayName ? stringAvatar(displayName).children : null}
    </MyAvatar>
  );

  return showBadge ? (
    <StyledBadge overlap="circular" anchorOrigin={{ vertical: "bottom", horizontal: "right" }} variant="dot">
      {avatarComponent}
    </StyledBadge>
  ) : (
    avatarComponent
  );
};

export default UserAvatar;
