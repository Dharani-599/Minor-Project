"use client"

import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, CartesianGrid, Legend
} from "recharts"
import type { Expense } from "@/types/expense"

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f7f", "#00C49F"]

type Props = {
  expenses: Expense[]
}

export const ExpenseChart = ({ expenses }: Props) => {
  // Group total per category
  const categoryTotals: { [category: string]: number } = {}
  expenses.forEach((expense) => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount
  })

  const pieData = Object.entries(categoryTotals).map(([category, total]) => ({
    name: category,
    value: total,
  }))

  // Group expenses by category and month
  const categoryMonthlyTotals: { [category: string]: { [month: string]: number } } = {}

  expenses.forEach((expense) => {
    const category = expense.category
    const date = new Date(expense.date)
    const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`

    if (!categoryMonthlyTotals[category]) {
      categoryMonthlyTotals[category] = {}
    }
    categoryMonthlyTotals[category][month] =
      (categoryMonthlyTotals[category][month] || 0) + expense.amount
  })

  // Unique months sorted
  const allMonths = Array.from(
    new Set(
      expenses.map((e) => {
        const d = new Date(e.date)
        return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}`
      })
    )
  ).sort()

  // Build lineData object
  const lineDataMap: { [month: string]: any } = {}
  allMonths.forEach((month) => {
    lineDataMap[month] = { month }
    for (const category in categoryMonthlyTotals) {
      lineDataMap[month][category] = categoryMonthlyTotals[category][month] || 0
    }
  })

  // Forecast using linear regression for each category
  for (const category in categoryMonthlyTotals) {
    const months = Object.keys(categoryMonthlyTotals[category]).sort()
    if (months.length < 2) continue

    const x: number[] = []
    const y: number[] = []

    months.forEach((month, i) => {
      x.push(i)
      y.push(categoryMonthlyTotals[category][month])
    })

    const n = x.length
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
    const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n
    const forecast = slope * n + intercept

    const lastMonth = months[months.length - 1]
    const nextDate = new Date(lastMonth + "-01")
    nextDate.setMonth(nextDate.getMonth() + 1)
    const nextMonth = `${nextDate.getFullYear()}-${(nextDate.getMonth() + 1).toString().padStart(2, "0")}`

    if (!lineDataMap[nextMonth]) lineDataMap[nextMonth] = { month: nextMonth }
    lineDataMap[nextMonth][category] = Math.max(0, forecast)
  }

  const lineData = Object.values(lineDataMap).sort((a, b) =>
    a.month.localeCompare(b.month)
  )

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 mt-6 space-y-8">
      <h2 className="text-xl font-semibold">Expenses by Category</h2>
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
            {pieData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <h2 className="text-xl font-semibold mt-8">Forecast by Category (Next Month)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={lineData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {Object.keys(categoryTotals).map((category, index) => (
            <Line
              key={category}
              type="monotone"
              dataKey={category}
              stroke={COLORS[index % COLORS.length]}
              strokeWidth={2}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
