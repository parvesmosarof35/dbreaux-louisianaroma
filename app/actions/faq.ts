"use server";

import { revalidateTag } from "next/cache";

/**
 * Revalidates the cache tag for general FAQs.
 * This is called from client components (such as the admin dashboard) 
 * when an admin creates, updates, or dissolves a general FAQ.
 */
export async function revalidateFaqs() {
  revalidateTag("faq", "max");
}
