export function formatCurrency(
    amount: number,
    currency: string = 'USD',
    locale: string = 'en-US'
): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount)
}

export function parseCurrencyToNumber(formatted: string): number {
    // Remove currency symbols and parse to float
    const cleaned = formatted.replace(/[^0-9.-]+/g, '')
    return parseFloat(cleaned)
}
