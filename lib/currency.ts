export const formatPrice = (price: number, currency: string = 'USD') => {
  if (currency === 'USD') {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  }
  return `${price.toLocaleString()} RWF`
}

export const formatPriceShort = (price: number, currency: string = 'USD') => {
  if (currency === 'USD') {
    return `$${price.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
  }
  if (price >= 1000000) {
    const m = price / 1000000
    return `${m % 1 === 0 ? m : m.toFixed(1)}M RWF`
  }
  if (price >= 10000) {
    const k = price / 1000
    return `${k % 1 === 0 ? k : k.toFixed(1)}K RWF`
  }
  return `${price.toLocaleString()} RWF`
}

export const convertPrice = (price: number, fromCurrency: string, toCurrency: string) => {
  // Simple conversion rate: 1 USD = 1300 RWF
  const USD_TO_RWF = 1300
  
  if (fromCurrency === toCurrency) return price
  
  if (fromCurrency === 'USD' && toCurrency === 'RWF') {
    return price * USD_TO_RWF
  }
  
  if (fromCurrency === 'RWF' && toCurrency === 'USD') {
    return price / USD_TO_RWF
  }
  
  return price
}