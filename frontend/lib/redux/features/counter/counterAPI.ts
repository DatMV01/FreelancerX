export const fetchCount = async (amount = 1) => {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return { data: amount + 1 };
};
