import { baseApi } from "./baseApi";

export const collectionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/collections/create_collection (FormData: data + image)
    createCollection: builder.mutation<any, FormData>({
      query: (formData) => ({
        url: "collections/create_collection",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["collection"],
    }),

    // GET /api/v1/collections/find_all
    getAllCollections: builder.query<any, any>({
      query: (params = {}) => ({
        url: "collections/find_all",
        method: "GET",
        params,
      }),
      providesTags: ["collection"],
    }),

    // GET /api/v1/collections/find_one/:id
    getCollection: builder.query<any, string>({
      query: (id) => ({ url: `collections/find_one/${id}`, method: "GET" }),
      providesTags: ["collection"],
    }),

    // PATCH /api/v1/collections/update_collection/:id (FormData: data + image)
    updateCollection: builder.mutation<any, { id: string; formData: FormData }>({
      query: ({ id, formData }) => ({
        url: `collections/update_collection/${id}`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["collection"],
    }),

    // DELETE /api/v1/collections/delete_collection/:id
    deleteCollection: builder.mutation<any, string>({
      query: (id) => ({
        url: `collections/delete_collection/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["collection"],
    }),
  }),
});

export const {
  useCreateCollectionMutation,
  useGetAllCollectionsQuery,
  useGetCollectionQuery,
  useUpdateCollectionMutation,
  useDeleteCollectionMutation,
} = collectionApi;

export default collectionApi;
