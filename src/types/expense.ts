



export type Expense ={
    id:number;
    title:string;
    amount:number;
    category:string;
    date:string;
    pages?:number
};


export type NewExpense = Omit<Expense, "id">

export type UpdateExpense = Partial<Omit<Expense, "id">>;