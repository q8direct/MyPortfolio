export const formatCurrency = (value: number): string => {
  // Determine decimal places based on price
  const decimalPlaces = value < 1 ? 6 : 2;
  
  // Format with commas and proper decimal places
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
    useGrouping: true // This ensures commas are added for thousands
  }).format(value);
};

export const formatPercentage = (value: number): string => {
  return `${(value >= 0 ? '+' : '')}${value.toFixed(2)}%`;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: value < 1 ? 6 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
    useGrouping: true // This ensures commas are added for thousands
  }).format(value);
};

export const formatDate = (date: string): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date));
};