import useGetUserInfo from "@/hooks/useGetUserInfo";
import { selectUser } from "@/lib/redux/features/auth/authSlice";
import { useAppSelector } from "@/lib/redux/hooks";
import { stringAvatar } from "@/lib/utils";
import { Avatar } from "@mui/material";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import { Session } from "next-auth";
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
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

const MyAvatar = ({
  avatarUrl,
  fontSize,
  height,
  width,
  children,
}: {
  avatarUrl?: string;
  fontSize?: number;
  height?: number;
  width?: number;
  children?: ReactNode;
}) => {
  return (
    <Avatar
      sx={{
        height: height,
        width: height,
        fontSize: fontSize,
      }}
      alt="Avatar"
      src={avatarUrl}
    >
      {children}
    </Avatar>
  );
};

const AvatarOnline = ({
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
  if (avatarUrl) {
    if (showBadge) {
      return (
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          variant="dot"
        >
          <MyAvatar avatarUrl={avatarUrl} height={height} width={width} />
        </StyledBadge>
      );
    }

    return <MyAvatar avatarUrl={avatarUrl} height={height} width={width} />;
  }

  if (fullName) {
    return (
      <MyAvatar height={height} width={width} fontSize={fontSize}>
        {stringAvatar(fullName).children}
      </MyAvatar>
    );
  }

  //const { isAuthenticated, user, session } = useGetUserInfo();
  const user = useAppSelector(selectUser);
  const avatar = user?.avatar;

  return (
    <>
      {avatar ? (
        showBadge ? (
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <MyAvatar avatarUrl={user.avatar} height={height} width={width} />
          </StyledBadge>
        ) : (
          <MyAvatar avatarUrl={user.avatar} height={height} width={width} />
        )
      ) : (
        <MyAvatar height={height} width={width} fontSize={fontSize}>
          {stringAvatar(user?.fullName).children}
        </MyAvatar>
      )}
    </>
  );
};

export default AvatarOnline;
