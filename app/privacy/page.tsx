import PrivacyClient from "./PrivacyClient";
import { url } from "@/store/config/envConfig";

export const metadata = {
  title: "Privacy Policy | Louisianaroma",
  description: "Learn how the Maison Louisianaroma collects, preserves, and honors the digital legacy and preferences of our scent collectors.",
};

/**
 * Fetches privacy policy data on the server-side with Next.js data cache tag 'privacy'.
 */
async function getPrivacy() {
  const fetchUrl = `${url}setting/find_by_privacy_policyss`;

  try {
    const res = await fetch(fetchUrl, {
      method: "GET",
      next: {
        tags: ["privacy"],
      },
    });

    if (!res.ok) {
      console.error(`Privacy fetch failed with status: ${res.status}`);
      return "";
    }

    const result = await res.json();
    return result?.data?.PrivacyPolicy || result?.data?.privacyPolicy || "";
  } catch (error) {
    console.error("Error fetching Privacy on the server:", error);
    return "";
  }
}

export default async function PrivacyPage() {
  const privacy = await getPrivacy();
  return <PrivacyClient initialPrivacy={privacy} />;
}
