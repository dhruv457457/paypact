import type React from "react"
import { cn } from "../../lib/utils"

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => {
  return (
    <div className={cn("grid md:auto-rows-[18rem] grid-cols-1 md:grid-cols-3 gap-4 max-w-7xl mx-auto", className)}>
      {children}
    </div>
  )
}

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
}) => {
  return (
    <div
      className={cn(
        "row-span-1 rounded-xl group/bento hover:shadow-xl transition-all duration-300 shadow-sm bg-[#0C0C0E] border border-[#1C1C1E] text-white p-4 justify-between flex flex-col space-y-4 backdrop-blur-sm min-h-80",
        className,
      )}
    >
      {header}
      <div className="group-hover/bento:translate-x-2 transition duration-200">
        {icon}
        <div className="font-semibold text-slate-900 dark:text-white mb-2 mt-2">{title}</div>
        <div className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{description}</div>
      </div>
    </div>
  )
}
