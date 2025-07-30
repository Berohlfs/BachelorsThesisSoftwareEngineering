"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { getYear, setYear, addMonths, subMonths, format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { useNavigation } from "react-day-picker"

export const FullCaption = ({ displayMonth }: { displayMonth: Date }) => {
  const { goToMonth } = useNavigation()
  const currentYear = getYear(displayMonth)

  const startYear = 1945
  const endYear = 2035
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  return (
    <div className="flex items-center justify-between px-2 pt-1 w-full">
      {/* ⬅️ Prev Month */}
      <button
        onClick={() => goToMonth?.(subMonths(displayMonth, 1))}
        className="hover:opacity-80 transition cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">
          {format(displayMonth, "MMMM", {locale: ptBR})}
        </span>

        <select
          className="text-sm px-1 py-1 border rounded-sm bg-background"
          value={currentYear}
          onChange={(e) =>
            goToMonth?.(setYear(displayMonth, parseInt(e.target.value)))
          }
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {/* ➡️ Next Month */}
      <button
        onClick={() => goToMonth?.(addMonths(displayMonth, 1))}
        className="hover:opacity-80 transition cursor-pointer"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      defaultMonth={props.selected as Date}
      classNames={{
        months: "flex flex-col sm:flex-row gap-2",
        month: "flex flex-col gap-4",
        caption: "flex justify-center pt-1 relative items-center w-full",
        caption_label: "text-sm font-medium",
        nav: "flex items-center gap-1",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "size-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-x-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "size-8 p-0 font-normal aria-selected:opacity-100"
        ),
        day_outside: "text-muted-foreground",
        ...classNames,
      }}
      components={{
        Caption: FullCaption,
      }}
      {...props}
    />
  )
}

export { Calendar }