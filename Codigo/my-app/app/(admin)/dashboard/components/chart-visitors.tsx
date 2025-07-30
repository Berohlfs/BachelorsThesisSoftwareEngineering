"use client"

import * as React from "react"
import { Cell, Label, Pie, PieChart, Sector, Tooltip } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff8042",
  "#8dd1e1",
  "#a4de6c",
]

export function TopSellingProductsChart({
  data,
}: {
  data: {
    name: string
    quantity: number
  }[]
}) {
  const [activeIndex, setActiveIndex] = React.useState(0)

  return (
    <Card data-chart="pie-products">
      <ChartStyle
        id="pie-products"
        config={data.reduce((acc, cur, i) => {
          acc[cur.name] = {
            label: cur.name,
            color: COLORS[i % COLORS.length],
          }
          return acc
        }, {} as ChartConfig)}
      />
      <CardHeader>
        <CardDescription>Últimos 30 dias</CardDescription>
        <CardTitle className="text-2xl font-bold">
          {data[activeIndex]?.quantity.toLocaleString()} vendidos
        </CardTitle>
        <CardAction>
          <Select
            value={data[activeIndex]?.name}
            onValueChange={(value) =>
              setActiveIndex(data.findIndex((item) => item.name === value))
            }
          >
            <SelectTrigger className="ml-auto h-8 w-[180px]">
              <SelectValue placeholder="Selecionar produto" />
            </SelectTrigger>
            <SelectContent align="end">
              {data.map((item, index) => (
                <SelectItem key={item.name} value={item.name}>
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-sm"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    {item.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id="pie-products"
          config={{}}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <Tooltip formatter={(value: number) => `${value} unidades`} />
            <Pie
              data={data}
              dataKey="quantity"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex}
              activeShape={({ outerRadius = 0, ...props }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {data[activeIndex]?.quantity.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Vendidos
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
