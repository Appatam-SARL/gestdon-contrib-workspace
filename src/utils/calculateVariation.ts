const calculateVariation = (
  previousValue: number,
  currentValue: number
): number => {
  if (previousValue === 0) {
    return 0;
  }
  const variation = ((currentValue - previousValue) * 100) / previousValue;
  return parseFloat(variation.toFixed(2));
};

export default calculateVariation;
