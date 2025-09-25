import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '../ui/utils'

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap transition-all duration-200"
    
    const variants = {
      default: "bg-muted/20 text-muted border border-muted/20",
      primary: "gradient-primary text-white shadow-md",
      secondary: "gradient-secondary text-white shadow-md",
      success: "bg-success/10 text-success border border-success/20",
      warning: "bg-warning/10 text-warning border border-warning/20",
      error: "bg-error/10 text-error border border-error/20",
      outline: "border border-border text-foreground hover:bg-surface"
    }
    
    const sizes = {
      sm: "h-5 px-2 text-xs",
      md: "h-6 px-3 text-xs",
      lg: "h-8 px-4 text-sm"
    }

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Badge.displayName = "Badge"