import { LucideIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '../ui/Button'

interface EmptyStateProps {
    icon: LucideIcon
    title: string
    description: string
    actionLabel?: string
    onAction?: () => void
    children?: React.ReactNode
}

export default function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
    children
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-8 md:p-12 text-center bg-slate-800/30 border border-slate-700/50 rounded-2xl border-dashed"
        >
            <div className="p-4 bg-slate-800 rounded-full mb-4 shadow-xl">
                <Icon className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-slate-400 max-w-sm mb-6">{description}</p>

            {actionLabel && onAction && (
                <Button onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
            {children}
        </motion.div>
    )
}
