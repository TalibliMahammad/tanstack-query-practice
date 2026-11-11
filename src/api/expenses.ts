import type { Expense } from "../types/expense";

const API_URL = "http://localhost:3000";

export async function getExpenses(): Promise<Expense[]> {
  const response = await fetch(`${API_URL}/expenses`);

  if (!response.ok) {
    throw new Error("Expenses could not be loaded");
  }

  const data: Expense[] = await response.json();

  return data;
}

export async function getExpensesById(id:number): Promise<Expense> {
  const responseById = await fetch(`${API_URL}/expenses/${id}`);

  if (!responseById.ok) throw new Error("Expenses could not be loaded");

  const data: Expense = await responseById.json();
  
  return data;

}


