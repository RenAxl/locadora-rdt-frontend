import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiUrl;

export const API = {
  BASE: BASE_URL,

  AUTH: {
    TOKEN: `${BASE_URL}/oauth/token`,
  },

  CATALOG: {
    ROOT: `${BASE_URL}/catalog`,
    BY_ID: (id: number | string) => `${BASE_URL}/catalog/${id}`,
    IMAGE: (id: number | string) => `${BASE_URL}/catalog/${id}/image`,
  },

  RENTALS: {
    ROOT: `${BASE_URL}/rentals`,
    BY_ID: (id: number | string) => `${BASE_URL}/rentals/${id}`,
    CONFIRM: (id: number | string) => `${BASE_URL}/rentals/${id}/confirm`,
    CURRENT_CUSTOMER: `${BASE_URL}/rentals/current-customer`,
  },

  USERS: {
    ROOT: `${BASE_URL}/users`,
    BY_ID: (id: number | string) => `${BASE_URL}/users/${id}`,
    DELETE_ALL: `${BASE_URL}/users/all`,
    CHANGE_ACTIVE: (id: number | string) => `${BASE_URL}/users/${id}/active`,
    ACTIVATE: `${BASE_URL}/auth/activate`,
    PHOTO: (id: number) => `${BASE_URL}/users/${id}/photo`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset-password`,
  },

  ROLES: {
    ROOT: `${BASE_URL}/roles`,
    BY_ID: (id: number | string) => `${BASE_URL}/roles/${id}`,
    PERMISSIONS: (id: number | string) => `${BASE_URL}/roles/${id}/permissions`,
  },

  PERMISSIONS: {
    ROOT: `${BASE_URL}/permissions`,
    BY_ID: (id: number | string) => `${BASE_URL}/permissions/${id}`,
    GROUPS: `${BASE_URL}/permissions/groups`,
  },

  CUSTOMERS: {
    ROOT: `${BASE_URL}/customers`,
    BY_ID: (id: number | string) => `${BASE_URL}/customers/${id}`,
    PHOTO: (id: number) => `${BASE_URL}/customers/${id}/photo`,
    DELETE_ALL: `${BASE_URL}/customers/all`,
    CHANGE_ACTIVE: (id: number | string) =>
      `${BASE_URL}/customers/${id}/active`,

    FILES: {
      ROOT: (customerId: number | string) =>
        `${BASE_URL}/customers/${customerId}/files`,

      VIEW: (customerId: number | string, fileId: number | string) =>
        `${BASE_URL}/customers/${customerId}/files/${fileId}/view`,
      BY_ID: (customerId: number, fileId: number) =>
        `${BASE_URL}/customers/${customerId}/files/${fileId}`,
      DOWNLOAD: (customerId: number, fileId: number) =>
        `${BASE_URL}/customers/${customerId}/files/${fileId}/download`,
    },
  },

  SUPPLIERS: {
    ROOT: `${BASE_URL}/suppliers`,
    BY_ID: (id: number | string) => `${BASE_URL}/suppliers/${id}`,
    IMAGE: (id: number | string) => `${BASE_URL}/suppliers/${id}/image`,
    FILES: {
      ROOT: (supplierId: number | string) =>
        `${BASE_URL}/suppliers/${supplierId}/files`,
      VIEW: (supplierId: number | string, fileId: number | string) =>
        `${BASE_URL}/suppliers/${supplierId}/files/${fileId}/view`,
      BY_ID: (supplierId: number, fileId: number) =>
        `${BASE_URL}/suppliers/${supplierId}/files/${fileId}`,
      DOWNLOAD: (supplierId: number, fileId: number) =>
        `${BASE_URL}/suppliers/${supplierId}/files/${fileId}/download`,
    },
  },

  EMPLOYEES: {
    ROOT: `${BASE_URL}/employees`,
    BY_ID: (id: number | string) => `${BASE_URL}/employees/${id}`,
    PHOTO: (id: number) => `${BASE_URL}/employees/${id}/photo`,
    DELETE_ALL: `${BASE_URL}/employees/all`,
    CHANGE_ACTIVE: (id: number | string) =>
      `${BASE_URL}/employees/${id}/active`,
    FILES: {
      ROOT: (employeeId: number | string) =>
        `${BASE_URL}/employees/${employeeId}/files`,
      VIEW: (employeeId: number | string, fileId: number | string) =>
        `${BASE_URL}/employees/${employeeId}/files/${fileId}/view`,
      BY_ID: (employeeId: number, fileId: number) =>
        `${BASE_URL}/employees/${employeeId}/files/${fileId}`,
      DOWNLOAD: (employeeId: number, fileId: number) =>
        `${BASE_URL}/employees/${employeeId}/files/${fileId}/download`,
    },
  },

  RENTAL: {
    CATEGORIES: {
      ROOT: `${BASE_URL}/rental/categories`,
      BY_ID: (id: number | string) => `${BASE_URL}/rental/categories/${id}`,
      IMAGE: (id: number | string) =>
        `${BASE_URL}/rental/categories/${id}/image`,
      DELETE_ALL: `${BASE_URL}/rental/categories/all`,
      CHANGE_ACTIVE: (id: number | string) =>
        `${BASE_URL}/rental/categories/${id}/active`,
    },
    RENTAL_TYPES: {
      ROOT: `${BASE_URL}/rental/rentaltypes`,
      BY_ID: (id: number | string) =>
        `${BASE_URL}/rental/rentaltypes/${id}`,
      DELETE_ALL: `${BASE_URL}/rental/rentaltypes/all`,
      CHANGE_ACTIVE: (id: number | string) =>
        `${BASE_URL}/rental/rentaltypes/${id}/active`,
    },
    ITEMS: {
      ROOT: `${BASE_URL}/inventory/items`,
      BY_ID: (id: number | string) => `${BASE_URL}/inventory/items/${id}`,
      IMAGE: (id: number | string) => `${BASE_URL}/inventory/items/${id}/image`,
      DELETE_ALL: `${BASE_URL}/inventory/items/all`,
      CHANGE_ACTIVE: (id: number | string) =>
        `${BASE_URL}/inventory/items/${id}/active`,
    },
    STOCK_BALANCES: {
      ROOT: `${BASE_URL}/inventory/stock-balances`,
      BY_ID: (id: number | string) =>
        `${BASE_URL}/inventory/stock-balances/${id}`,
      BY_ITEM: (itemId: number | string) =>
        `${BASE_URL}/inventory/stock-balances/item/${itemId}`,
    },
    STOCK_MOVEMENTS: {
      ROOT: `${BASE_URL}/inventory/stock-movements`,
      BY_ID: (id: number | string) =>
        `${BASE_URL}/inventory/stock-movements/${id}`,
    },
  },

  PAYMENT_METHODS: {
    ROOT: `${BASE_URL}/payment-methods`,
    BY_ID: (id: number | string) => `${BASE_URL}/payment-methods/${id}`,
    DELETE_ALL: `${BASE_URL}/payment-methods/all`,
  },

  PAYMENT_FREQUENCIES: {
    ROOT: `${BASE_URL}/payment-frequencies`,
    BY_ID: (id: number | string) => `${BASE_URL}/payment-frequencies/${id}`,
    DELETE_ALL: `${BASE_URL}/payment-frequencies/all`,
  },

  FINANCIAL_SETTINGS: {
    ROOT: `${BASE_URL}/financial-settings`,
  },

  RECEIVABLES: {
    ROOT: `${BASE_URL}/receivables`,
    BY_ID: (id: number | string) => `${BASE_URL}/receivables/${id}`,
    PAY: (id: number | string) => `${BASE_URL}/receivables/${id}/payments`,
    INSTALLMENTS: (id: number | string) =>
      `${BASE_URL}/receivables/${id}/installments`,
    REPORT: `${BASE_URL}/receivables/report`,
    RECEIPT: (id: number | string) => `${BASE_URL}/receivables/${id}/receipt`,
    FISCAL_COUPON: (id: number | string) =>
      `${BASE_URL}/receivables/${id}/fiscal-coupon`,
    FILES: {
      ROOT: (receivableId: number | string) =>
        `${BASE_URL}/receivables/${receivableId}/files`,
      VIEW: (receivableId: number | string, fileId: number | string) =>
        `${BASE_URL}/receivables/${receivableId}/files/${fileId}/view`,
      BY_ID: (receivableId: number | string, fileId: number | string) =>
        `${BASE_URL}/receivables/${receivableId}/files/${fileId}`,
      DOWNLOAD: (receivableId: number | string, fileId: number | string) =>
        `${BASE_URL}/receivables/${receivableId}/files/${fileId}/download`,
    },
  },

  PAYABLES: {
    ROOT: `${BASE_URL}/payables`,
    BY_ID: (id: number | string) => `${BASE_URL}/payables/${id}`,
    PAY: (id: number | string) => `${BASE_URL}/payables/${id}/payments`,
    INSTALLMENTS: (id: number | string) =>
      `${BASE_URL}/payables/${id}/installments`,
    REPORT: `${BASE_URL}/payables/report`,
    FILES: {
      ROOT: (payableId: number | string) =>
        `${BASE_URL}/payables/${payableId}/files`,
      VIEW: (payableId: number | string, fileId: number | string) =>
        `${BASE_URL}/payables/${payableId}/files/${fileId}/view`,
      BY_ID: (payableId: number | string, fileId: number | string) =>
        `${BASE_URL}/payables/${payableId}/files/${fileId}`,
      DOWNLOAD: (payableId: number | string, fileId: number | string) =>
        `${BASE_URL}/payables/${payableId}/files/${fileId}/download`,
    },
  },

  REPORTS: {
    ROOT: `${BASE_URL}/reports/financial-reports`,
    GENERATE: (reportType: string, format: string) =>
      `${BASE_URL}/reports/financial-reports/${reportType}/${format}`,
    COMPARISON: `${BASE_URL}/reports/financial-reports/comparison`,
  },

  INVENTORY_REPORTS: {
    ROOT: `${BASE_URL}/reports/inventory-reports`,
    GENERATE: (reportType: string, format: string) =>
      `${BASE_URL}/reports/inventory-reports/${reportType}/${format}`,
  },

  POSITIONS: {
    ROOT: `${BASE_URL}/positions`,
    BY_ID: (id: number | string) => `${BASE_URL}/positions/${id}`,
  },

  DEPARTMENTS: {
    ROOT: `${BASE_URL}/departments`,
    BY_ID: (id: number | string) => `${BASE_URL}/departments/${id}`,
  },
} as const;
