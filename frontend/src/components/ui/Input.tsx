import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    helperText?: string
    icon?: React.ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, helperText, icon, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-slate-300 mb-2">
                        {label}
                        {props.required && <span className="text-danger-400 ml-1">*</span>}
                    </label>
                )}
                <div className="relative">
                    {icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                            {icon}
                        </div>
                    )}
                    <input
                        ref={ref}
                        className={`input ${icon ? 'pl-10' : ''} ${error ? 'ring-2 ring-danger-500' : ''} ${className}`}
                        {...props}
                    />
                </div>
                {error && (
                    <p className="mt-1 text-sm text-danger-400">{error}</p>
                )}
                {helperText && !error && (
                    <p className="mt-1 text-sm text-slate-400">{helperText}</p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'

export default Input
