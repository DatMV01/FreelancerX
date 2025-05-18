import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
};

export const stringAvatar = (name: string = "Avatar") => {
  const _name = name.toUpperCase();
  const nameArr = _name.split(" ");
  if (nameArr.length === 0) {
    return {
      sx: {
        bgcolor: stringToColor(_name),
      },
      children: `${_name}`,
    };
  }

  if (nameArr.length === 1) {
    return {
      sx: {
        bgcolor: stringToColor(_name),
      },
      children: `${_name.split(" ")[0][0]}`,
    };
  }
  return {
    sx: {
      bgcolor: stringToColor(_name),
    },
    children: `${_name.split(" ")[0][0]}${_name.split(" ")[1][0]}`,
  };
};

export const getFirstTwoLetters = (name: string = "Avatar") => {
  const _name = name.toUpperCase();
  const nameArr = _name.split(" ");
  if (nameArr.length === 0) {
    return `${_name}`;
  }

  if (nameArr.length === 1) {
    return `${_name.split(" ")[0][0]}`;
  }

  return `${_name.split(" ")[0][0]}${_name.split(" ")[1][0]}`;
};

export function parsePriceRange(range?: string) {
  if (!range) return { priceMin: undefined, priceMax: undefined };

  if (range.includes("+")) {
    const min = parseInt(range.replace("+", ""), 10);
    return { priceMin: min, priceMax: undefined };
  }

  const [min, max] = range.split("-").map(Number);
  return { priceMin: min, priceMax: max };
}

// const { query } = useRouter();
// const { priceMin, priceMax } = parsePriceRange(query.priceRange as string);

export const passwordSchema = z
  .string()
  .min(6, { message: "Password must be at least 6 characters long" })
  .regex(/\d/, { message: "Password must include at least one number" })
  .regex(/[!@#$%^&*(),.?":{}|<>_\-+=~`[\]\\;/]/, {
    message: "Password must include at least one special character",
  });
