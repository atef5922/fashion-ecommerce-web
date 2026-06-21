export type CurrencyCode = "BDT";

export const DEFAULT_CURRENCY: CurrencyCode = "BDT";
export const FREE_SHIPPING_THRESHOLD = 5000;
export const STANDARD_SHIPPING_FEE = 120;

const currencyConfig: Record<CurrencyCode, { symbol: string; locale: string }> = {
  BDT: {
    symbol: "৳",
    locale: "en-US"
  }
};

export function formatCurrency(value: number, currency: CurrencyCode = DEFAULT_CURRENCY) {
  const config = currencyConfig[currency];
  const formattedValue = new Intl.NumberFormat(config.locale, {
    maximumFractionDigits: 0
  }).format(value);

  return `${config.symbol}${formattedValue}`;
}
