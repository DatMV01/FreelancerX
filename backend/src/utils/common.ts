export const isNumberParse = (str: string): boolean => {
  return !isNaN(parseFloat(str)) && isFinite(Number(str));
};

export const consoleSuccess = (str: any) => {
  console.log('✅');
  console.log('✅');
  console.log(`${str}`);
  console.log('✅');
  console.log('✅');
};

export const consoleError = (str: any) => {
  console.error('❌');
  console.error('❌');
  console.error(`${str}`);
  console.error('❌');
  console.error('❌');
};
