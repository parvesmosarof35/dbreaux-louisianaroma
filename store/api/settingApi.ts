import { baseApi } from "./baseApi";

const settingApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPrivacy: builder.query({
      query: () => ({
        url: "setting/find_by_privacy_policyss",
        method: "GET",
      }),
      providesTags: ["privacy"],
    }),
    updatePrivacy: builder.mutation({
      query: (data) => ({
        url: "setting/privacy_policys",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["privacy"],
    }),

    getTermsAndConditions: builder.query({
      query: () => ({
        url: "setting/find_by_terms_conditions",
        method: "GET",
      }),
      providesTags: ["termsAndConditions"],
    }),
    updateTermsAndConditions: builder.mutation({
      query: (data) => ({
        url: "setting/terms_conditions",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["termsAndConditions"],
    }),

    getAboutUs: builder.query({
      query: () => ({
        url: "setting/find_by_about_us",
        method: "GET",
      }),
      providesTags: ["aboutUs"],
    }),
    updateAboutUs: builder.mutation({
      query: (data) => ({
        url: "setting/about",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["aboutUs"],
    }),

    getBrandingSocials: builder.query({
      query: () => ({
        url: "setting/find_by_branding_socials",
        method: "GET",
      }),
      providesTags: ["contact"],
    }),
    updateBrandingSocials: builder.mutation({
      query: (data) => ({
        url: "setting/branding_socials",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["contact"],
    }),
  }),
});

export const {
  useGetPrivacyQuery,
  useUpdatePrivacyMutation,
  useGetTermsAndConditionsQuery,
  useUpdateTermsAndConditionsMutation,
  useGetAboutUsQuery,
  useUpdateAboutUsMutation,
  useGetBrandingSocialsQuery,
  useUpdateBrandingSocialsMutation,
} = settingApi;

export default settingApi;
