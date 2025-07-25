import Big from 'big.js';

export const formatCurrency = (value: string) => {
  const balance = new Big(value);
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
  }).format(balance.toNumber());
  return formatted;
};

export const convertCamelToTitleCase = (text: string | undefined) => {
  if (!text) return '';
  const result = text.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};
