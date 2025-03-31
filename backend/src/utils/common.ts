export const isNumberParse = (str: string): boolean => {
  return !isNaN(parseFloat(str)) && isFinite(Number(str));
};

export function consoleSuccess(msg: any): void;
export function consoleSuccess(title: string, msg: any): void;
export function consoleSuccess(titleOrMsg: string | any, msg?: any): void {
  const title = msg ? titleOrMsg : 'SUCCESS';
  const message = msg || titleOrMsg;

  console.log('✅');
  console.log(`========== ${title} ==========`);
  console.log(`${message}`);
  console.log('✅');
}

export function consoleError(msg: any): void;
export function consoleError(title: string, msg: any): void;
export function consoleError(titleOrMsg: string | any, msg?: any): void {
  const title = msg ? titleOrMsg : 'ERROR';
  const message = msg || titleOrMsg;

  console.log('❌');
  console.log(`========== ${title} ==========`);
  console.log(`${message}`);
  console.log('❌');
}

export function convertNullToUndefined(obj: any): any {
  if (obj === null) return undefined; // Chuyển null thành undefined

  if (Array.isArray(obj)) {
    return obj.map(convertNullToUndefined); // Xử lý từng phần tử trong mảng
  } else if (obj instanceof Date) {
    return obj; // Giữ nguyên nếu là kiểu Date
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key,
        convertNullToUndefined(value),
      ]),
    );
  }

  return obj; // Trả về nguyên nếu không phải null hoặc object
}

export function removeUndefinedFields(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefinedFields);
  } else if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== undefined),
    );
  }
  return obj;
}
