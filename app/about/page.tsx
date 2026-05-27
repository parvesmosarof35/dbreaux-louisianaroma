import AboutClient from "./AboutClient";
import { url } from "@/store/config/envConfig";

export const metadata = {
  title: "The Heritage of Scent | Louisianaroma",
  description: "Discover the artistic ancestry of Louisianaroma, Grasse extraction ateliers, and the philosophy of bespoke olfactory preservation.",
};

/**
 * Fetches about us data on the server-side with Next.js data cache tag 'aboutUs'.
 */
async function getAboutUs() {
  const fetchUrl = `${url}setting/find_by_about_us`;

  try {
    const res = await fetch(fetchUrl, {
      method: "GET",
      next: {
        tags: ["aboutUs"],
      },
    });

    if (!res.ok) {
      console.error(`About Us fetch failed with status: ${res.status}`);
      return null;
    }

    const result = await res.json();
    return result?.data || null;
  } catch (error) {
    console.error("Error fetching About Us on the server:", error);
    return null;
  }
}

export default async function AboutPage() {
  const aboutUsData = await getAboutUs();
  return <AboutClient initialData={aboutUsData} />;
}
