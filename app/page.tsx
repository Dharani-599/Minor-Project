"use client"

import { useEffect, useState } from "react"
import {ExpenseForm} from "@/components/expense-form"
import { ExpenseList } from "@/components/expense-list"
import { ExpenseSummary } from "@/components/expense-summary"
import type { Expense } from "@/types/expense"
import { ExpenseChart } from "@/components/expense-chart"

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)

  useEffect(() => {
    const savedExpenses = localStorage.getItem("expenses")
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses))
    }
  }, [])

  // Save expenses to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses))
  }, [expenses])

  const addExpense = (expense: Expense) => {
    setExpenses([...expenses, expense])
  }

  const updateExpense = (updatedExpense: Expense) => {
    setExpenses(expenses.map((expense) => (expense.id === updatedExpense.id ? updatedExpense : expense)))
    setEditingExpense(null)
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const startEditing = (expense: Expense) => {
    setEditingExpense(expense)
  }

  const cancelEditing = () => {
    setEditingExpense(null)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-8">Expense Tracker</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <ExpenseForm
            onAddExpense={addExpense}
            onUpdateExpense={updateExpense}
            editingExpense={editingExpense}
            onCancelEdit={cancelEditing}
          />

          <ExpenseList expenses={expenses} onDeleteExpense={deleteExpense} onEditExpense={startEditing} />
          <ExpenseChart expenses={expenses}/>
        </div>

        <div>
          <ExpenseSummary expenses={expenses} />
     

        </div>
      </div>
    </div>
  )
}