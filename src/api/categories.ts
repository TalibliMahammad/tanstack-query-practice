import type { categories } from "../types/categories";

const API_URL = "http://localhost:3000";

export async function getCategories(): Promise<categories[]> {
  const response = await fetch(`${API_URL}/categories`);

if(!response.ok){
    throw new Error("Server Error")
}


const data:categories[] = await response.json()

return data;

}
