import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// ─── Response Types ────────────────────────────────────────────────────────────

export interface BlogData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  author: string;
  excerpt: string;
  image: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyData {
  _id: string;
  title: string;
  description: string;
  price: number;
  location: { address: string; area: string; city: string };
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  size: number;
  images: string[];
  amenities: string[];
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PartnerData {
  _id: string;
  name: string;
  logo: string;
  website: string;
  order: number;
  active: boolean;
}

interface MutationResponse {
  message: string;
}

// ─── API Slice ────────────────────────────────────────────────────────────────

// RTK Query API Slice — single source of truth for all client-side API calls
export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Property", "Blog", "Inquiry", "Partner"],
  endpoints: (builder) => ({
    // ─── Properties ───────────────────────────────────────
    createProperty: builder.mutation<MutationResponse, Record<string, unknown>>({
      query: (data) => ({
        url: "/properties",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Property"],
    }),

    updateProperty: builder.mutation<MutationResponse, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/properties/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Property"],
    }),

    deleteProperty: builder.mutation<MutationResponse, string>({
      query: (id) => ({
        url: `/properties/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Property"],
    }),

    getPropertyById: builder.query<PropertyData, string>({
      query: (id) => `/properties/${id}`,
      providesTags: ["Property"],
    }),

    // ─── Blogs ────────────────────────────────────────────
    createBlog: builder.mutation<MutationResponse, Record<string, unknown>>({
      query: (data) => ({
        url: "/blogs",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    updateBlog: builder.mutation<MutationResponse, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Blog"],
    }),

    deleteBlog: builder.mutation<MutationResponse, string>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    getBlogById: builder.query<BlogData, string>({
      query: (id) => `/blogs/${id}`,
      providesTags: ["Blog"],
    }),

    // ─── Inquiries ────────────────────────────────────────
    submitInquiry: builder.mutation<MutationResponse, Record<string, unknown>>({
      query: (data) => ({
        url: "/inquiries",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Inquiry"],
    }),

    updateInquiryStatus: builder.mutation<MutationResponse, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/inquiries/${id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Inquiry"],
    }),

    deleteInquiry: builder.mutation<MutationResponse, string>({
      query: (id) => ({
        url: `/inquiries/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Inquiry"],
    }),

    // ─── Partners ────────────────────────────────────────
    createPartner: builder.mutation<MutationResponse, Record<string, unknown>>({
      query: (data) => ({
        url: "/partners",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Partner"],
    }),

    updatePartner: builder.mutation<MutationResponse, { id: string; data: Record<string, unknown> }>({
      query: ({ id, data }) => ({
        url: `/partners/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Partner"],
    }),

    deletePartner: builder.mutation<MutationResponse, string>({
      query: (id) => ({
        url: `/partners/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Partner"],
    }),

    getPartnerById: builder.query<PartnerData, string>({
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
