"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Expense } from "@/types/expense"

interface ExpenseFormProps {
  onAddExpense: (expense: Expense) => void
  onUpdateExpense: (expense: Expense) => void
  editingExpense: Expense | null
  onCancelEdit: () => void
}

export function ExpenseForm({ onAddExpense, onUpdateExpense, editingExpense, onCancelEdit }: ExpenseFormProps) {
  const [title, setTitle] = useState("")
  const [amount, setAmount] = useState("")
  const [category, setCategory] = useState("general")
  const [date, setDate] = useState("")

  // Set form values when editing an expense
  useEffect(() => {
    if (editingExpense) {
      setTitle(editingExpense.title)
      setAmount(editingExpense.amount.toString())
      setCategory(editingExpense.category)
      setDate(editingExpense.date)
    }
  }, [editingExpense])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !amount || !date) return

    const expenseData: Expense = {
      id: editingExpense ? editingExpense.id : uuidv4(),
      title,
      amount: Number.parseFloat(amount),
      category,
      date,
      createdAt: editingExpense ? editingExpense.createdAt : new Date().toISOString(),
    }

    if (editingExpense) {
      onUpdateExpense(expenseData)
    } else {
      onAddExpense(expenseData)
    }

    resetForm()
  }

  const resetForm = () => {
    setTitle("")
    setAmount("")
    setCategory("general")
    setDate("")
  }

  const handleCancel = () => {
    resetForm()
    onCancelEdit()
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{editingExpense ? "Edit Expense" : "Add New Expense"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Expense title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="transportation">Transportation</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="utilities">Utilities</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            {editingExpense && (
              <Button type="button" variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            )}
            <Button type="submit">{editingExpense ? "Update" : "Add"} Expense</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

