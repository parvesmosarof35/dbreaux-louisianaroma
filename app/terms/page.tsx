import TermsClient from "./TermsClient";
import { url } from "@/store/config/envConfig";

export const metadata = {
  title: "Terms & Conditions | Louisianaroma",
  description: "Read the terms of service, custom fragrance commissions, and artisanal codes governing the Maison Louisianaroma.",
};

/**
 * Fetches terms and conditions data on the server-side with Next.js data cache tag 'termsAndConditions'.
 */
async function getTerms() {
  const fetchUrl = `${url}setting/find_by_terms_conditions`;

  try {
    const res = await fetch(fetchUrl, {
      method: "GET",
      next: {
        tags: ["termsAndConditions"],
      },
    });

    if (!res.ok) {
      console.error(`Terms fetch failed with status: ${res.status}`);
      return "";
    }

    const result = await res.json();
    return result?.data?.TermsConditions || result?.data?.termsConditions || "";
  } catch (error) {
    console.error("Error fetching Terms on the server:", error);
    return "";
  }
}

export default async function TermsPage() {
  const terms = await getTerms();
  return <TermsClient initialTerms={terms} />;
}
