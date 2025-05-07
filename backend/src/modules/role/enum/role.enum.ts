export enum RoleEnum {
  ADMIN = 1,
  BUYER = 2,
  FREELANCER = 3,
  GUEST = 4,
  // REGISTERED = 5,
}

export const roleKey = Object.keys(RoleEnum).filter((key) =>
  isNaN(Number(key)),
);

export type RoleKey = keyof typeof RoleEnum;
