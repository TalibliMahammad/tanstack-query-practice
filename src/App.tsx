import { useQuery } from "@tanstack/react-query";
import { getExpenses, getExpensesById } from "./api/expenses";
import { useState } from "react";
import ExpenseDetails from "./expenseDetail";

function App() {
  const [expenseId, setExpenseId] = useState(1);
  const [showExpense, setShowExpense] = useState(true);
  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ["Expenses", expenseId],
    queryFn: () => getExpensesById(expenseId),
    staleTime: 0,
    gcTime: 5 * 1000,
    refetchOnMount: true,
  });

  if (isPending) return <h2>Loading Expenses...</h2>;

  if (isError) return <h2>Error:{error.message}</h2>;

  return (
    <div className=" flex  flex-col gap-5 ">
      <h1>My Expenses</h1>
      {isFetching && <p>Refreshing...</p>}

      <div className=" flex gap-5 ">
        <div
          className=" bg-gray-500 text-white h-25  w-45 flex-wrap-reverse border  rounded-md"
          key={data.id}
        >
          <h3>{data.title}</h3>
          <p>Amount:${data.amount}</p>
          <p>Category:{data.category} </p>
        </div>
      </div>

      {[1].map((id) => (
        <button
          className="bg-blue-500 border rounded-2xl w-70 h-20"
          onClick={() => setExpenseId(id)}
        >
          {" "}
          Expense {id}
        </button>
      ))}

      <button
        className="bg-blue-500 border rounded-2xl w-70 h-20"
        onClick={() => setShowExpense((prev) => !prev)}
      >
        Show / Hide Expense
      </button>
      {showExpense && <ExpenseDetails expenseId={expenseId} />}
    </div>
  );
}

export default App;
