import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns'

export function formatDate(date: string | Date, formatStr: string = 'MMM d, yyyy'): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date

    if (!isValid(dateObj)) {
        return 'Invalid date'
    }

    return format(dateObj, formatStr)
}

export function formatRelativeTime(date: string | Date): string {
    const dateObj = typeof date === 'string' ? parseISO(date) : date

    if (!isValid(dateObj)) {
        return 'Invalid date'
    }

    return formatDistanceToNow(dateObj, { addSuffix: true })
}

export function formatDateTime(date: string | Date): string {
    return formatDate(date, 'MMM d, yyyy h:mm a')
}
