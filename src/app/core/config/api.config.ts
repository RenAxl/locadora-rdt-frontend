import { environment } from 'src/environments/environment';

const BASE_URL = environment.apiUrl;

export const API = {
  BASE: BASE_URL,

  USERS: {
    ROOT: `${BASE_URL}/users`,
    BY_ID: (id: number | string) => `${BASE_URL}/users/${id}`,
    DELETE_ALL: `${BASE_URL}/users/all`,
    CHANGE_ACTIVE: (id: number | string) => `${BASE_URL}/users/${id}/active`,
    ACTIVATE: `${BASE_URL}/users/activate`
  },

  ROLES: {
    ROOT: `${BASE_URL}/roles`,
    BY_ID: (id: number | string) => `${BASE_URL}/roles/${id}`,
    PERMISSIONS: (id: number | string) => `${BASE_URL}/roles/${id}/permissions`
  },

  PERMISSIONS: {
    ROOT: `${BASE_URL}/permissions`,
    BY_ID: (id: number | string) => `${BASE_URL}/permissions/${id}`,
    GROUPS: `${BASE_URL}/permissions/groups`,
  },

} as const;
