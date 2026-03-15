import type { Contact } from '../../types/common';
import { apiClient } from '../../services/api/client';

export const ContactsApi = {
  list: () => apiClient.get<Contact[]>('/contacts'),
  create: (payload: Omit<Contact, 'id'>) => apiClient.post<Contact>('/contacts', payload),
  update: (id: string, payload: Partial<Contact>) => apiClient.put<Contact>(`/contacts/${id}`, payload),
  remove: (id: string) => apiClient.del<void>(`/contacts/${id}`),
};
