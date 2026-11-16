import {
  keepPreviousData,
  useInfiniteQuery,
  useQuery,
} from "@tanstack/react-query";
import {
  getExpensePage,
  getExpenses,
  getExpensesById,
  getExpensesCategory,
} from "./api/expenses";
import { getCategories } from "./api/categories";
import { useState } from "react";

function App() {
  const [page, setPage] = useState(2);

  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["Expenses"],
    queryFn: () => getExpensesById(7),
  });

  const { data:categories = [] } = useQuery({
    queryKey: [  "categories",`${data?.category}`],
    queryFn:()=> getExpensesCategory(data?.category ?? ""),
    enabled: !! data?.category
  });

  const query = useInfiniteQuery({
    queryKey: ["expensePage"],
    queryFn: ({ pageParam }) => getExpensePage(pageParam),
    initialPageParam:1,

    getNextPageParam: (lastPage, allPages) => {
     

      if (lastPage.length < 2) {
        return undefined;
      } else {
         return allPages.length + 1;
      }


    },


    
  });

  if (isPending) return <h2>Loading Expenses...</h2>;

  if (isError) return <h2>Error:{error.message}</h2>;

  return (
    <div className=" flex bg-gray-400  items-center pt-5 text-white flex-col gap-5 ">
      <h1 className="flex justify-center  bg-blue-900 p-5  rounded-2xl  ">
        My Expenses
      </h1>
      {isFetching && <p>Refreshing...</p>}

      <div className=" flex flex-col gap-5 ">
        <div className="flex  gap-4 flex-wrap justify-center">
          {data.map((data) => (
            <div
              className=" bg-blue-800 text-white h-25  w-45  text-center border  rounded-md"
              key={data.id}
            >
              <h3>{data.title}</h3>
              <p>Amount:${data.amount}</p>
              <p>Category:{data.category} </p>
            </div>
          ))}
        </div>

        <div>
          <div className="flex gap-5">
            <button
              onClick={() => setPage((prev) => prev + 1)}
              className="bg-green-500 w-40"
            >
              Next
            </button>
            <span className="bg-blue-500  p-5 rounded-2xl animate-pulse">
              {page}
            </span>
            <button
              disabled={page === 1 || isFetching}
              onClick={() => setPage((prev) => prev - 1)}
              className="bg-red-500 w-40"
            >
              Previos
            </button>
          </div>
        </div>

        {/* <div className="flex  gap-5 flex-col  items-center ">
          {categories?.map((category) => (
            <p
              className=" justify-center w-40 flex  bg-blue-800 text-white border  rounded-md"
              key={category.id}
            >
              {category.category}
            </p>
          ))}
        </div> */}
      </div>
    </div>
  );
}

export default App;
