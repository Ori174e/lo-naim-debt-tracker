interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    text?: string
}

export default function LoadingSpinner({ size = 'md', text }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div className={`animate-spin rounded-full border-t-2 border-b-2 border-primary-500 ${sizeClasses[size]}`} />
            {text && <p className="text-slate-400 text-sm">{text}</p>}
        </div>
    )
}
