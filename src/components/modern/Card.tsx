import { forwardRef } from 'react'
import { motion } from 'motion/react'
import { cn } from '../ui/utils'

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'elevated'
  hover?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', hover = true, children, ...props }, ref) => {
    const baseStyles = "rounded-2xl border overflow-hidden"

    const variants = {
      default: "bg-white/80 border-surface-border shadow-md",
      glass: "glass shadow-lg",
      elevated: "bg-white border-surface-border shadow-xl"
    }

    const hoverStyles = hover ? "hover:shadow-xl hover:-translate-y-1 transition-all duration-300" : ""

    return (
      <motion.div
        ref={ref}
        className={cn(baseStyles, variants[variant], hoverStyles, className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Card.displayName = "Card"

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pb-4", className)} {...props} />
  )
)

CardHeader.displayName = "CardHeader"

export const CardTitle = forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
  )
)

CardTitle.displayName = "CardTitle"

export const CardDescription = forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted mt-2", className)} {...props} />
  )
)

CardDescription.displayName = "CardDescription"

export const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)

CardContent.displayName = "CardContent"

export const CardFooter = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("pt-0 flex items-center justify-between", className)}
      {...props}
    />
  )
)

CardFooter.displayName = "CardFooter"