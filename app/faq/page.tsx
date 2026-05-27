import FAQClient from "./FaqClient";
import { url } from "@/store/config/envConfig";

export const metadata = {
  title: "Questions & Concierge | Louisianaroma",
  description: "Explore our most frequent inquiries regarding fragrance formulation commissions, atelier maturation times, shipping vaults, and bespoke olfactory craftsmanship.",
};

/**
 * Fetches general FAQs on the server-side with Next.js data cache tag 'faq'.
 */
async function getFaqs() {
  const fetchUrl = `${url}faq/findB_by_all_faq?page=1&limit=50`;

  try {
    const res = await fetch(fetchUrl, {
      method: "GET",
      next: {
        tags: ["faq"],
      },
    });

    if (!res.ok) {
      console.error(`FAQ Fetch failed with status: ${res.status}`);
      return [];
    }

    const result = await res.json();
    return result?.data?.data || result?.data || [];
  } catch (error) {
    console.error("Error fetching FAQs on the server:", error);
    return [];
  }
}

export default async function FAQPage() {
  const faqs = await getFaqs();
  return <FAQClient initialFaqs={faqs} />;
}
