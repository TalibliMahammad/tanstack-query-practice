import {
  keepPreviousData,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createExpense,
  deleteExpense,
  getExpensePage,
  getExpenses,
  getExpensesById,
  getExpensesCategory,
  updateExpense,
} from "./api/expenses";
import { getCategories } from "./api/categories";
import { useState } from "react";
import type { Expense, NewExpense, UpdateExpense } from "./types/expense";
import { toast, ToastContainer } from "react-toastify";

type updateMutationVaribles = {
  id: number;
  data: UpdateExpense;
};

function App() {
  // const [page, setPage] = useState(2);
  const [formData, setFormData] = useState<UpdateExpense>({
    amount: null,
    title: "",
    category: "",
  });

  const queryClient = useQueryClient();

  const { data, isPending, isError, error, isFetching } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  // const { data:categories = [] } = useQuery({
  //   queryKey: [  "categories",`${data?.category}`],
  //   queryFn:()=> getExpensesCategory(data?.category ?? ""),
  //   enabled: !! data?.category
  // });

  // const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
  //   useInfiniteQuery({
  //     queryKey: ["expensePage"],

  //     queryFn: async ({ pageParam }) => {
  //       await new Promise((resolve) => setTimeout(resolve, 1000));
  //       return getExpensePage(pageParam);
  //     },
  //     initialPageParam: 1,

  //     getNextPageParam: (lastPage, allPages) => {
  //       if (lastPage.length < 2) {
  //         return undefined;
  //       } else {
  //         return allPages.length + 1;
  //       }
  //     },
  //   });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: updateMutationVaribles) =>
      updateExpense(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["expenses"],
      });

      setFormData({
        amount: "",
        title: "",
        category: "",
      });
    },

    onError: (error) => {
      console.log("Server Error", error.message);
    },
  });

  const useDeleteMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
      // BU kod funksiya expensestsdən  funksiyanı  çağırır

      mutationFn: ({ id }: updateMutationVaribles) => deleteExpense(id),
      mutationKey: ["deleteExpense"],

      // davam edən sorğunu ləğv edir
      onMutate: async (id) => {
        await queryClient.cancelQueries({
          queryKey: ["expenses"],
        });

        // Köhnə sorğunun məlumatlarını yadda saxlayır.
        const previousExpenses = queryClient.getQueryData(["expenses"]);

        //   silinəcək məlumatları cachedən çıxarır
        queryClient.setQueryData<Expense[]>(
          ["expenses"],
          (oldData) => oldData?.filter((item) => item.id !== id.id) ?? [],
        );
        console.log(previousExpenses);
        // əvvəlki məlumatları qaytarır
        return { previousExpenses };
      },

      onSuccess: () => {
        toast.success("Expense successfully deleted!");
      },

      // uğursuz olduqda  əvvəlki məlumatları qaytarır
      onError: (_error, id, context) => {
        queryClient.setQueryData(["expenses"], context?.previousExpenses);

        toast.error("Serverdən silinmədi uğursuz cəhd");
      },

      onSettled: () => {
        if (queryClient.isMutating({ mutationKey: ["deleteExpense"] }) === 1) {
          queryClient.invalidateQueries({
            queryKey: ["expenses"],
          });
        }
      },
    });
  };

  const DeleteMutation = useDeleteMutation();

  // const Product = {
  //   title: "Book",
  //   amount: 20,
  //   category: "Education",
  //   date: "2026-11-17",
  // };

  if (isPending) return <h2>Loading Expenses...</h2>;

  if (isError) return <h2>Error:{error.message}</h2>;

  return (
    <div className=" flex bg-gray-400  items-center pt-5 text-white flex-col gap-5 ">
      <h1 className="flex justify-center  bg-blue-900 p-5  rounded-2xl  ">
        My Expenses
      </h1>
      {isFetching && <p>Refreshing...</p>}

      <ToastContainer position="top-right" />

      <div className="min-h-screen p-6 flex flex-col items-center justify-center gap-10">
        <div className="flex gap-10 flex-wrap justify-center w-full max-w-4xl">
          {data?.map((item) => (
            <div
              className="bg-slate-900  text-slate-100 w-full max-w-sm p-6 border border-slate-800 rounded-2xl shadow-xl transition hover:border-slate-700"
              key={item.id}
            >
              <div className="flex items-start justify-between gap-3 mb-4">
                <h3 className="text-lg font-semibold text-white leading-snug">
                  {item.title}
                </h3>
                <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">
                  {item.category}
                </span>
              </div>

              <div className="mb-6 p-3.5 rounded-xl bg-slate-800/70 border border-slate-800 flex items-center justify-between">
                <span className="text-sm text-slate-400">Mövcud məbləğ</span>
                <p className="text-xl font-bold text-emerald-400">
                  ${item.amount}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-xs font-medium text-slate-400">
                  Yeni məbləğ daxil edin
                </label>

                <input
                  value={formData.amount}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      amount: Number(e.target.value),
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  type="number"
                  placeholder="Məs: 120"
                />
                <input
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  type="text"
                  placeholder="Əlavə sahə 2"
                />
                <input
                  value={formData.category}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      category: e.target.value,
                    });
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 text-white placeholder-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  type="text"
                  placeholder="Əlavə sahə 3"
                />

                <button
                  disabled={isPending}
                  onClick={() => {
                    updateMutation.mutate({ id: item.id!, data: formData! });
                  }}
                  className="mt-2 w-full py-2.5 px-5 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  Edit
                </button>

                <button
                  onClick={() => DeleteMutation.mutate({ id: item.id })}
                  className="mt-2 w-full py-2.5 px-5 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white shadow-md shadow-blue-600/20 transition cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* <div className="justify-center mt-5 flex gap-5">
    <button
      disabled={!hasNextPage || isFetchingNextPage}
      onClick={() => fetchNextPage()}
      className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition"
    >
      {isFetchingNextPage ? "Loading..." : "Load more"}
    </button>
  </div> */}

        {/* <button
    onClick={() => mutation.mutate(Product)}
    className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-xl transition"
  >
    add expense
  </button> */}

        {/* <div className="flex items-center gap-4">
    <button
      onClick={() => setPage((prev) => prev + 1)}
      className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-5 py-2.5 rounded-xl transition"
    >
      Next
    </button>
    <span className="bg-slate-800 text-white font-semibold px-4 py-2.5 rounded-xl border border-slate-700 animate-pulse">
      {page}
    </span>
    <button
      disabled={page === 1 || isFetching}
      onClick={() => setPage((prev) => prev - 1)}
      className="bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-xl transition"
    >
      Previous
    </button>
  </div> */}

        {/* <div className="flex gap-3 flex-wrap justify-center">
    {categories?.map((category) => (
      <p
        className="px-4 py-2 text-sm font-medium bg-slate-900 text-slate-200 border border-slate-800 rounded-xl"
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
