import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { getExpensesById } from "../expenses";

type ExpenseDetailProps = {
  expenseId: number;
};

export default function ExpenseDetail({ expenseId }: ExpenseDetailProps) {
  const queryClient = useQueryClient();

  const { data, isError, isPending } = useQuery({
    queryKey: ["expenses", expenseId],
    queryFn: () => getExpensesById(expenseId),
  });

  console.log(data);

if (isPending) return <p>Loading...</p>;

if (isError) return <p>Server error</p>;

  return (
    <div className="relative"> 
      <div className=" text-center flex-col absolute justify-center flex  bg-white text-black  rounded-2xl w-40 h-30">
        <h3>Category: {data.category}</h3>
        <h2>Expense: {data.title}</h2>
        <h3>Amount: {data.amount} Manat</h3>
        <h3>Id: {data.id}</h3>
      </div>
    </div>
  );
}
