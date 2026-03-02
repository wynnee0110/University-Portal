import { BACKEND_BASE_URL } from "@/constants";
import { createDataProvider, CreateDataProviderOptions } from "@refinedev/rest";

// Backend response shapes
type BackendListResponse<T = Record<string, unknown>> = {
  subjects?: T[];
  data?: T[];
  pagination?: {
    currentPage?: number;
    totalPages?: number;
    totalItems?: number | string;
    total?: number;
    itemsPerPage?: number;
  };
};

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


      });
      return params;
    },

    mapResponse: async (response) => {
      const payload: BackendListResponse = await response.json();
      // backend returns `subjects` key; fall back to `data` for other resources
      return (payload.subjects ?? payload.data ?? []) as object[];
    },

    getTotalCount: async (response) => {
      const payload: BackendListResponse = await response.json();
      const p = payload.pagination;
      // backend uses `totalItems`; fall back to `total`
      const total = p?.totalItems ?? p?.total;
      return total !== undefined ? +total : (payload.subjects ?? payload.data ?? []).length;
    },
  },
};

const { dataProvider } = createDataProvider(BACKEND_BASE_URL, options);

export { dataProvider };