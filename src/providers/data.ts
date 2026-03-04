import { BACKEND_BASE_URL } from "@/constants";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";
import type { HttpError } from "@refinedev/core";
import { CreateResponse } from "@/types";

// Backend response shapes
type BackendListResponse<T = Record<string, unknown>> = {
  subjects?: T[];
  users?: T[];
  data?: T[];
  pagination?: {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number | string;
    total?: number;
    itemsPerPage?: number;
  };
};

if (!BACKEND_BASE_URL) {
  throw new Error("BACKEND_BASE_URL is required");
}

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = 'request failed';

  try {
    const payload = await response.json() as { message?: string };
    if (payload?.message) message = payload.message;

  } catch (error) {

  }

  return {
    message,
    statusCode: response.status,

  }

}

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource,

    buildQueryParams: async ({ resource, filters, pagination }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;
      const params: Record<string, string | number> = { page, limit: pageSize };

      filters?.forEach((filter) => {
        const field = 'field' in filter ? filter.field : '';
        const value = String(filter.value);

        if (resource === 'subjects') {
          if (field === 'department') params.department = value;
          if (field === 'name' || field === 'code') params.search = value;
        }
        if (resource === 'users') {
          if (field === 'role') params.role = value;
          if (field === 'name') params.search = value;
        }


      });
      return params;
    },

    mapResponse: async (response) => {
      if (!response.ok) {
        throw await buildHttpError(response);
      }
      const payload: BackendListResponse = await response.json();
      // backend returns resource-keyed arrays; fall back to `data`
      return (payload.subjects ?? payload.users ?? payload.data ?? []) as object[];
    },

    getTotalCount: async (response) => {
      const payload: BackendListResponse = await response.json();
      const p = payload.pagination;
      // backend uses `totalItems`; fall back to `total`
      const total = p?.totalItems ?? p?.total;
      return total !== undefined ? +total : (payload.subjects ?? payload.users ?? payload.data ?? []).length;
    },
  },
  create: {
    getEndpoint: ({ resource }) => resource,
    buildBodyParams: async ({ variables }) => variables,
    mapResponse: async (response) => {
      const json: CreateResponse = await response.json();
      if (!response.ok) {
        throw await buildHttpError(response);
      }
      return json.data ?? json;
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };