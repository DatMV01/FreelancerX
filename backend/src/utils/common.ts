export const isNumberParse = (str: string): boolean => {
  return !isNaN(parseFloat(str)) && isFinite(Number(str));
};
