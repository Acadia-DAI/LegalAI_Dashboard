import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '../ui/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'glass'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  children: React.ReactNode
  isLoading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, isLoading, disabled, ...props }, ref) => {
    const baseStyles = "relative inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-solid/50 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
    
    const variants = {
      primary: "text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 gradient-primary",
      secondary: "text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 gradient-secondary",
      ghost: "text-foreground hover:bg-surface hover:text-foreground",
      outline: "border border-border text-foreground hover:bg-surface hover:border-primary-solid",
      glass: "glass text-foreground hover:bg-surface-hover shadow-md hover:shadow-lg"
    }
    
    const sizes = {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg",
      icon: "h-10 w-10"
    }

    return (
      <motion.button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        {variant === 'primary' && (
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        )}
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            <span>Loading...</span>
          </div>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)

Button.displayName = "Button"