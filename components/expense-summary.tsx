"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Expense } from "@/types/expense"

interface ExpenseSummaryProps {
  expenses: Expense[]
}

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  const summary = useMemo(() => {
    // Calculate total expenses
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)

    // Calculate expenses by category
    const byCategory: Record<string, number> = {}
    expenses.forEach((expense) => {
      byCategory[expense.category] = (byCategory[expense.category] || 0) + expense.amount
    })

    // Calculate expenses for current month
    const now = new Date()
    const currentMonth = now.getMonth()
    const currentYear = now.getFullYear()

    const thisMonth = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear
      })
      .reduce((sum, expense) => sum + expense.amount, 0)

    // Calculate expenses for previous month
    const lastMonth = new Date(currentYear, currentMonth - 1)
    const lastMonthExpenses = expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date)
        return expenseDate.getMonth() === lastMonth.getMonth() && expenseDate.getFullYear() === lastMonth.getFullYear()
      })
      .reduce((sum, expense) => sum + expense.amount, 0)

    // Calculate month-over-month change
    const monthChange = lastMonthExpenses ? ((thisMonth - lastMonthExpenses) / lastMonthExpenses) * 100 : 0

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
              <h3 className="text-sm font-medium text-muted-foreground">Total Expenses</h3>
              <p className="text-2xl font-bold">₹{summary.total.toFixed(2)}</p>
            </div>

            <div>
              <h3 className="text-sm font-medium text-muted-foreground">This Month</h3>
              <p className="text-xl font-semibold">₹{summary.thisMonth.toFixed(2)}</p>
              {summary.lastMonth > 0 && (
                <p className={`text-xs ${summary.monthChange < 0 ? "text-green-600" : "text-red-600"}`}>
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
                  <div key={category} className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 rounded-full bg-primary opacity-${
                          Math.round((amount / summary.total) * 10) * 10
                        }`}
                      />
                      <span>{getCategoryName(category)}</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="font-medium">₹{amount.toFixed(2)}</span>
                      <span className="text-xs text-muted-foreground">
                        {((amount / summary.total) * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

