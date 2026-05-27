"use server";

import { revalidateTag } from "next/cache";

/**
 * Revalidates the cache tag for products.
 * This is called from client components (such as the admin dashboard) 
 * when an admin creates, updates, or dissolves a product.
 */
export async function revalidateProducts() {
  revalidateTag("products", "max");
}
