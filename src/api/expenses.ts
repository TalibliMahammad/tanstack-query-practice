import type { Expense, NewExpense, UpdateExpense } from "../types/expense";

const API_URL = "http://localhost:3000";

export async function getExpenses(): Promise<Expense[]> {
  const response = await fetch(`${API_URL}/expenses`);

  if (!response.ok) {
    throw new Error("Expenses could not be loaded");
  }

  const data: Expense[] = await response.json();

  return data;
}

export async function getExpensesById(id: number): Promise<Expense> {
  const responseById = await fetch(`${API_URL}/expenses/${id}`);

  if (!responseById.ok) throw new Error("Expenses could not be loaded");

  const data: Expense = await responseById.json();

  return data;
}

export async function getExpensesCategory(
  category: string,
): Promise<Expense[]> {
  const responseCategory = await fetch(
    `${API_URL}/expenses?category=${category}`,
  );

  if (!responseCategory.ok) throw new Error("category is not");

  const data: Expense[] = await responseCategory.json();

  return data;
}

export async function getExpensePage(page: number): Promise<Expense[]> {
  const response = await fetch(`${API_URL}/expenses?_page=${page}&_limit=2`);

  if (!response.ok) throw new Error("server Error");

  const data: Expense[] = await response.json();

  return data;
}

export async function createExpense(expense: NewExpense): Promise<Expense> {
  const response = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(expense),
  });

  if (!response.ok) {
    throw new Error("Server Error");
  }
  const data: Expense = await response.json();

  return data;
}

export async function updateExpense(
  id: number,
  updateExpense: UpdateExpense,
): Promise<Expense> {
  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(updateExpense),
  });
  if (!response.ok) {
    throw new Error("Server Error");
  }

  const data: Expense = await response.json();

  return data;
}

export async function deleteExpense(id: number): Promise<Expense> {
  if (id === 19) {
    throw new Error("Server Fail");
  }

  const response = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
    headers: {
      "content-type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Server Error");
  }

  const data = await response.json();

  return data;
}
