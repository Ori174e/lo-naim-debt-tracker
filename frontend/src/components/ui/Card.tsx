import { ReactNode } from 'react'

interface CardProps {
    children: ReactNode
    className?: string
    hover?: boolean
    onClick?: () => void
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
    const hoverClasses = hover ? 'glass-hover cursor-pointer' : ''
    const clickClasses = onClick ? 'cursor-pointer' : ''

    return (
        <div
            className={`card ${hoverClasses} ${clickClasses} ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    )
}
