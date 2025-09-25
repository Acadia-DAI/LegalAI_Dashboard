import { forwardRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '../ui/utils'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?: React.ReactNode
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type, ...props }, ref) => {
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(false)

    const handleFocus = () => setIsFocused(true)
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      setHasValue(e.target.value.length > 0)
    }

    return (
      <div className="relative flex-1">
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted z-10">
              {icon}
            </div>
          )}
          <input
            type={type}
            className={cn(
              "w-full h-12 px-4 py-3 bg-white/80 border border-border rounded-xl",
              "focus:outline-none focus:ring-2 focus:ring-primary-solid/50 focus:border-primary-solid",
              "transition-all duration-200 placeholder:text-muted",
              "hover:bg-white/90 hover:border-primary-solid/30",
              icon && "pl-10",
              label && "pt-6 pb-2",
              error && "border-error focus:ring-error/50 focus:border-error",
              className
            )}
            ref={ref}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {label && (
            <motion.label
              className={cn(
                "absolute left-4 text-muted pointer-events-none transition-all duration-200",
                (isFocused || hasValue) ? "top-2 text-xs font-medium" : "top-1/2 -translate-y-1/2",
                isFocused && "text-primary-solid",
                icon && (isFocused || hasValue) ? "left-4" : "left-10"
              )}
              animate={{
                y: (isFocused || hasValue) ? 0 : "50%",
                scale: (isFocused || hasValue) ? 0.85 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              {label}
            </motion.label>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1 text-sm text-error"
          >
            {error}
          </motion.p>
        )}
      </div>
    )
  }
)

Input.displayName = "Input"