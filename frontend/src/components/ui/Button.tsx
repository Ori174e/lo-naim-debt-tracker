import { ButtonHTMLAttributes, ReactNode } from 'react'
import { motion } from 'framer-motion'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'success'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
    children: ReactNode
}

export default function Button({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    disabled,
    children,
    className = '',
    ...props
}: ButtonProps) {
    const baseClasses = 'btn font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'

    const variantClasses = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        danger: 'btn-danger',
        success: 'btn-success',
    }

    const sizeClasses = {
        sm: 'px-4 py-2 text-sm rounded-lg',
        md: 'px-6 py-3 rounded-xl',
        lg: 'px-8 py-4 text-lg rounded-xl',
    }

    return (
        <motion.button
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    <span>Loading...</span>
                </div>
            ) : (
                children
            )}
        </motion.button>
    )
}
