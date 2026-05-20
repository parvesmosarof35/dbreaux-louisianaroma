import { baseApi } from "./baseApi";

export const inquiryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/v1/inquiries/create (Public submission)
    createInquiry: builder.mutation({
      query: (data) => ({
        url: "inquiries/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["inquiries"],
    }),
    
    // GET /api/v1/inquiries/find_all (Admin/Superadmin)
    // Supports query params: searchTerm, inquiryType, isRead (true/false), page, limit
    getInquiries: builder.query<any, any>({
      query: (paramsObj = {}) => {
        const { searchTerm = "", inquiryType = "", isRead = "", page = 1, limit = 10 } = paramsObj;
        const params = new URLSearchParams();
        if (searchTerm) params.append("searchTerm", searchTerm);
        if (inquiryType) params.append("inquiryType", inquiryType);
        if (isRead !== "") params.append("isRead", isRead.toString());
        params.append("page", page.toString());
        params.append("limit", limit.toString());
        return {
          url: `inquiries/find_all?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["inquiries"],
    }),

    // PATCH /api/v1/inquiries/mark_read/:id (Admin/Superadmin)
    markInquiryRead: builder.mutation({
      query: (id) => ({
        url: `inquiries/mark_read/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["inquiries"],
    }),

    // DELETE /api/v1/inquiries/delete/:id (Admin/Superadmin)
    deleteInquiry: builder.mutation({
      query: (id) => ({
        url: `inquiries/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["inquiries"],
    }),
  }),
});

export const {
  useCreateInquiryMutation,
  useGetInquiriesQuery,
  useMarkInquiryReadMutation,
  useDeleteInquiryMutation,
} = inquiryApi;

export default inquiryApi;
