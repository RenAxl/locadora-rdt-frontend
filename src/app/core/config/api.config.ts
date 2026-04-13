import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiUrl;

export const API = {
  BASE: BASE_URL,

  AUTH: {
    TOKEN: `${BASE_URL}/oauth/token`,
  },

  USERS: {
    ROOT: `${BASE_URL}/users`,
    BY_ID: (id: number | string) => `${BASE_URL}/users/${id}`,
    DELETE_ALL: `${BASE_URL}/users/all`,
    CHANGE_ACTIVE: (id: number | string) => `${BASE_URL}/users/${id}/active`,
    ACTIVATE: `${BASE_URL}/users/activate`,
    PHOTO: (id: number) => `${BASE_URL}/users/${id}/photo`,
    FORGOT_PASSWORD: `${BASE_URL}/users/forgot-password`,
    RESET_PASSWORD: `${BASE_URL}/users/reset-password`,
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

  POSITIONS: {
    ROOT: `${BASE_URL}/positions`,
    BY_ID: (id: number | string) => `${BASE_URL}/positions/${id}`,
  },
  
} as const;
