export const formatCurrency = (value: string) => {
  if (!value) return '';
  // Langsung format string sebagai integer
  const intValue = parseInt(value);
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(intValue);
};

export const convertCamelToTitleCase = (text: string | undefined) => {
  if (!text) return '';
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};
