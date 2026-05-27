"use server";

import { revalidateTag } from "next/cache";

/**
 * Revalidates the cache tag for About Us narrative and visuals.
 */
export async function revalidateAboutUs() {
  revalidateTag("aboutUs", "max");
}

/**
 * Revalidates the cache tag for Terms & Conditions.
 */
export async function revalidateTerms() {
  revalidateTag("termsAndConditions", "max");
}

/**
 * Revalidates the cache tag for Privacy Policy.
 */
export async function revalidatePrivacy() {
  revalidateTag("privacy", "max");
}
