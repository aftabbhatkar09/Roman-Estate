import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// RTK Query API Slice — single source of truth for all client-side API calls
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Property", "Blog", "Inquiry", "Partner"],
  endpoints: (builder) => ({
    // ─── Properties ───────────────────────────────────────
    createProperty: builder.mutation<any, any>({
      query: (data) => ({
        url: "/properties",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Property"],
    }),

    updateProperty: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Property"],
    }),

    deleteProperty: builder.mutation<any, string>({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),

    getPropertyById: builder.query<any, string>({
      query: (id) => `/properties/${id}`,
      providesTags: ["Property"],
    }),

    // ─── Blogs ────────────────────────────────────────────
    createBlog: builder.mutation<any, any>({
      query: (data) => ({
        url: "/blogs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    updateBlog: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    deleteBlog: builder.mutation<any, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    getBlogById: builder.query<any, string>({
      query: (id) => `/blogs/${id}`,
      providesTags: ["Blog"],
    }),

    // ─── Inquiries ────────────────────────────────────────
    submitInquiry: builder.mutation<any, any>({
      query: (data) => ({
        url: "/inquiries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inquiry"],
    }),

    updateInquiryStatus: builder.mutation<any, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/inquiries/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Inquiry"],
    }),

    deleteInquiry: builder.mutation<any, string>({
      query: (id) => ({
        url: `/inquiries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inquiry"],
    }),

    // ─── Partners ────────────────────────────────────────
    createPartner: builder.mutation<any, any>({
      query: (data) => ({
        url: "/partners",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Partner"],
    }),

    updatePartner: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/partners/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Partner"],
    }),

    deletePartner: builder.mutation<any, string>({
      query: (id) => ({
        url: `/partners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Partner"],
    }),

    getPartnerById: builder.query<any, string>({
      query: (id) => `/partners/${id}`,
      providesTags: ["Partner"],
    }),
  }),
});

// Auto-generated hooks for every endpoint
export const {
  useCreatePropertyMutation,
  useUpdatePropertyMutation,
  useDeletePropertyMutation,
  useGetPropertyByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  useGetBlogByIdQuery,
  useSubmitInquiryMutation,
  useUpdateInquiryStatusMutation,
  useDeleteInquiryMutation,
  useCreatePartnerMutation,
  useUpdatePartnerMutation,
  useDeletePartnerMutation,
  useGetPartnerByIdQuery,
} = apiSlice;
