// Mapping from app symbols to Yahoo Finance symbols
const YAHOO_MAP: Record<string, string> = {
  // Commodities
  "XAU/USD": "GC=F",
  "XAG/USD": "SI=F",
  "XPT/USD": "PL=F",
  // Forex
  "EUR/USD": "EURUSD=X",
  "USD/JPY": "JPY=X",
  "GBP/USD": "GBPUSD=X",
  "AUD/USD": "AUDUSD=X",
  // Crypto
  "BTC/USD": "BTC-USD",
  "ETH/USD": "ETH-USD",
};

export function isJapanese(sym: string) {
  return /^\d{4}$/.test(sym.trim()) || /^\d{3}[A-Z]$/.test(sym.trim());
}

export function toYahooSymbol(sym: string): string {
  if (isJapanese(sym)) return `${sym.trim()}.T`;
  return YAHOO_MAP[sym] ?? sym; // US stocks use same symbol on Yahoo
}
