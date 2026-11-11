import { useQuery } from "@tanstack/react-query";
import { getExpensesById } from "./api/expenses";

interface  ExpenseDetailsProps {
  expenseId: number;
  
};

 export default function ExpenseDetails({ expenseId }: ExpenseDetailsProps) {
  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ["expenses", expenseId],
    queryFn: () => getExpensesById(expenseId),
    staleTime: 0,
    gcTime: 60 * 1000,
    refetchOnMount: true,
  });



  if (isPending) return <h2>Loading Expenses...</h2>

  if (isError) return <h2>Error:{error.message}</h2>

  return (
    <div>
      {isFetching && <p>Refreshing...</p>}
      <h3>{data.title}</h3>
      <p>Amount: ${data.amount}</p>
      <p>Category: {data.category}</p>
    </div>
  );
}