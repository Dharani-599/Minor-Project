"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense } from "@/types/expense"
import SmartSavings from "./smartsaving"

interface ExpenseSummaryProps {
  expenses: Expense[]
}

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const summary = useMemo(() => {
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const thisMonthExpenses = expenses.filter((expense) => {
      const expenseDate = new Date(expense.date)
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      )
    })

    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    const byCategory: Record<string, number> = {}
    thisMonthExpenses.forEach((expense) => {
      byCategory[expense.category] =
        (byCategory[expense.category] || 0) + expense.amount
    })

    const thisMonth = thisMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    )

    const lastMonth = new Date(currentYear, currentMonth - 1)
    const lastMonthExpenses = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date)
        return (
          expenseDate.getMonth() === lastMonth.getMonth() &&
          expenseDate.getFullYear() === lastMonth.getFullYear()
        )
      })
      .reduce((sum, expense) => sum + expense.amount, 0)

    const monthChange = lastMonthExpenses
      ? ((thisMonth - lastMonthExpenses) / lastMonthExpenses) * 100
      : 0

    return {
      total,
      byCategory,
      thisMonth,
      lastMonth: lastMonthExpenses,
      monthChange,
    }
  }, [expenses])

  const getCategoryName = (key: string): string => {
    const categories: Record<string, string> = {
      food: "Food",
      transportation: "Transportation",
      entertainment: "Entertainment",
      utilities: "Utilities",
      shopping: "Shopping",
      general: "General",
    }
    return categories[key] || key.charAt(0).toUpperCase() + key.slice(1)
  }

  return (
    <div className="space-y-4 sticky top-4">
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Expenses
              </h3>
              <p className="text-2xl font-bold">₹{summary.total.toFixed(2)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                This Month
              </h3>
              <p className="text-xl font-semibold">
                ₹{summary.thisMonth.toFixed(2)}
              </p>
              {summary.lastMonth > 0 && (
                <p
                  className={`text-xs ${
                    summary.monthChange < 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {summary.monthChange > 0 ? "+" : ""}
                  {summary.monthChange.toFixed(1)}% vs last month
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>By Category</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(summary.byCategory).length === 0 ? (
            <p className="text-sm text-muted-foreground">No data available</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(summary.byCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div
                    key={category}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full bg-primary opacity-${
                          Math.round((amount / summary.thisMonth) * 10) * 10
                        }`}
                      />
                      <span>{getCategoryName(category)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-medium">
                        ₹{amount.toFixed(2)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {((amount / summary.thisMonth) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Smart savings using current month only */}
      <SmartSavings
        totalSpent={summary.thisMonth}
        categoryTotals={summary.byCategory}
      />
    </div>
  )
}
