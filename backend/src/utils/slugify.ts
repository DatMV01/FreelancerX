export const slugify = (str: string) => {
  return str.trim().toLowerCase().replaceAll(' ', '-');
};
