"use client"

import { Bar, BarChart, CartesianGrid, ComposedChart, XAxis, YAxis, Line } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import dayjs from "dayjs"

type Props = {
  data: {
    total_revenue: number;
    total_orders: number;
    month: string;
  }[]
}

export function ChartRevenue({ data }: Props) {

  const summary = () => (
    data.reduce(
      (acc, curr) => {
        acc.total_revenue += (curr?.total_revenue || 0);
        acc.total_orders += (curr?.total_orders || 0);
        return acc;
      },
      { total_revenue: 0, total_orders: 0 }
    )
  )

  const chartConfig = {
    total_revenue: {
      label: "Faturamento:",
      color: "var(--chart-1)",
    },
    total_orders: {
      label: "Vendas realizadas:",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl font-bold tracking-tight">
          {summary().total_revenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </CardTitle>
        <CardDescription>
          Faturamento dos últimos 12 meses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="aspect-[3/1]">
          <ComposedChart
            accessibilityLayer
            data={data}
            margin={{
              left: -16,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                new Intl.DateTimeFormat('pt-BR', { month: 'long' })
                  .format(new Date(`${value}-15`))
                  .slice(0, 3)
              }
            />

            <YAxis
              yAxisId="left"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
              domain={[0, "dataMax"]}
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(value) => value}
              domain={[0, "dataMax"]}
            />

            <ChartTooltip content={<ChartTooltipContent hideIndicator />} cursor={false} />

            <Bar
              yAxisId="left"
              dataKey="total_revenue"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="total_orders"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
