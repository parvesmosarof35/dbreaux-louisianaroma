import { baseApi } from "./baseApi";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/v1/products/find_all
    // `category` = MongoDB ObjectId of a Collection (from /collections/find_all)
    getProducts: builder.query<any, any>({
      query: (params = {}) => {
        const {
          category = "",
          searchTerm = "",
          isfeatured,
          isAvailable,
          minPrice,
          maxPrice,
          page = 1,
          limit = 9,
        } = params;
        const q = new URLSearchParams();
        if (category)                     q.append("category",    category);
        if (searchTerm)                   q.append("searchTerm",  searchTerm);
        if (isfeatured  !== undefined)    q.append("isfeatured",  String(isfeatured));
        if (isAvailable !== undefined)    q.append("isAvailable", String(isAvailable));
        if (minPrice    !== undefined)    q.append("minPrice",    String(minPrice));
        if (maxPrice    !== undefined)    q.append("maxPrice",    String(maxPrice));
        q.append("page",  String(page));
        q.append("limit", String(limit));
        return { url: `products/find_all?${q.toString()}`, method: "GET" };
      },
      providesTags: ["products"],
    }),

    // GET /api/v1/products/find_one/:id
    getProduct: builder.query<any, string>({
      query: (id) => ({ url: `products/find_one/${id}`, method: "GET" }),
      providesTags: ["products"],
    }),

    // POST /api/v1/products/create_product (FormData: data JSON + images files)
    // data JSON must include: name, label, category (ObjectId), price
    createProduct: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "products/create_product",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["products", "collection"],
    }),

    // PATCH /api/v1/products/update_product/:id (FormData: data JSON + optional images)
    updateProduct: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `products/update_product/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["products"],
    }),

    // DELETE /api/v1/products/delete_product/:id
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `products/delete_product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["products", "collection"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;

export default productApi;
