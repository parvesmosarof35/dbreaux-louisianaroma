import ShopClient from "./ShopClient";
import { url } from "@/store/config/envConfig";

export const metadata = {
  title: "Atelier Fragrances | Louisianaroma",
  description: "Browse our premium scent collections, woody, floral, and oud extractions at the Maison Louisianaroma.",
};

/**
 * Fetches collections and price metadata on the server-side with Next.js data cache tag 'collection'.
 */
async function getCollectionsData() {
  const fetchUrl = `${url}collections/find_all`;
  try {
    const res = await fetch(fetchUrl, {
      method: "GET",
      next: { tags: ["collection"] },
    });
    if (!res.ok) return { collections: [], globalMinPrice: 0, globalMaxPrice: 100 };

    const result = await res.json();
    const rawCols = result?.data?.data || result?.data || [];
    const collections = rawCols.map((c: any) => ({
      id: c._id || c.id,
      name: c.name,
      numberOfProducts: c.numberOfProducts ?? 0,
    }));

    const collectionsMeta = result?.meta || result?.data?.meta || {};
    const globalMinPrice = collectionsMeta.minPrice !== undefined ? Number(collectionsMeta.minPrice) : 0;
    const globalMaxPrice = collectionsMeta.maxPrice !== undefined ? Number(collectionsMeta.maxPrice) : 100;

    return { collections, globalMinPrice, globalMaxPrice };
  } catch (error) {
    console.error("Error fetching collections on server:", error);
    return { collections: [], globalMinPrice: 0, globalMaxPrice: 100 };
  }
}

/**
 * Fetches products on the server-side with Next.js data cache tag 'products' matching current filters.
 */
async function getProductsData(filters: any) {
  const q = new URLSearchParams();
  if (filters.category) q.append("category", filters.category);
  if (filters.searchTerm) q.append("searchTerm", filters.searchTerm);
  if (filters.minPrice !== undefined) q.append("minPrice", String(filters.minPrice));
  if (filters.maxPrice !== undefined) q.append("maxPrice", String(filters.maxPrice));
  if (filters.sortBy) q.append("sortBy", filters.sortBy);
  q.append("page", String(filters.page));
  q.append("limit", String(filters.limit));

  const fetchUrl = `${url}products/find_all?${q.toString()}`;
  try {
    const res = await fetch(fetchUrl, {
      method: "GET",
      next: { tags: ["products"] },
    });
    if (!res.ok) return { products: [], totalPages: 1 };

    const result = await res.json();
    const products = result?.data?.data || result?.data || [];
    const meta = result?.meta || result?.data?.meta || {};
    const totalPages = meta.totalPages || meta.totalPage || Math.ceil((meta.total || products.length) / filters.limit) || 1;

    return { products, totalPages };
  } catch (error) {
    console.error("Error fetching products on server:", error);
    return { products: [], totalPages: 1 };
  }
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<any> }) {
  const resolvedSearchParams = await searchParams;

  const { collections, globalMinPrice, globalMaxPrice } = await getCollectionsData();

  const category = resolvedSearchParams.category || "";
  const searchTerm = resolvedSearchParams.searchTerm || "";
  const minPrice = resolvedSearchParams.minPrice !== undefined ? Number(resolvedSearchParams.minPrice) : globalMinPrice;
  const maxPrice = resolvedSearchParams.maxPrice !== undefined ? Number(resolvedSearchParams.maxPrice) : globalMaxPrice;
  const sortBy = resolvedSearchParams.sortBy || "";
  const page = resolvedSearchParams.page !== undefined ? Number(resolvedSearchParams.page) : 1;
  const limit = resolvedSearchParams.limit !== undefined ? Number(resolvedSearchParams.limit) : 20;

  const filters = { category, searchTerm, minPrice, maxPrice, sortBy, page, limit };

  const { products, totalPages } = await getProductsData(filters);

  return (
    <ShopClient
      initialProducts={products}
      collections={collections}
      globalMinPrice={globalMinPrice}
      globalMaxPrice={globalMaxPrice}
      totalPages={totalPages}
      initialFilters={filters}
    />
  );
}
