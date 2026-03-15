import type { Contact } from '../../types/common';
import { apiClient } from '../../services/api/client';
import { mockStorage } from '../../services/mock/localDb';
import { contactsMock } from './contacts.mock';

export const ContactsApi = {
  list: () =>
    mockStorage.enabled ? mockStorage.get<Contact[]>('drm-contacts', contactsMock) : apiClient.get<Contact[]>('/contacts'),
  create: (payload: Omit<Contact, 'id'>) => {
    if (mockStorage.enabled) {
      const current = mockStorage.get<Contact[]>('drm-contacts', contactsMock);
      const newContact: Contact = { ...payload, id: `c-${Date.now()}` };
      const updated = [newContact, ...current];
      mockStorage.set('drm-contacts', updated);
      return Promise.resolve(newContact);
    }
    return apiClient.post<Contact>('/contacts', payload);
  },
  update: (id: string, payload: Partial<Contact>) => {
    if (mockStorage.enabled) {
      const current = mockStorage.get<Contact[]>('drm-contacts', contactsMock);
      const updatedList = current.map((c) => (c.id === id ? { ...c, ...payload } : c));
      const updated = updatedList.find((c) => c.id === id)!;
      mockStorage.set('drm-contacts', updatedList);
      return Promise.resolve(updated);
    }
    return apiClient.put<Contact>(`/contacts/${id}`, payload);
  },
  remove: (id: string) => {
    if (mockStorage.enabled) {
      const current = mockStorage.get<Contact[]>('drm-contacts', contactsMock).filter((c) => c.id !== id);
      mockStorage.set('drm-contacts', current);
      return Promise.resolve();
    }
    return apiClient.del<void>(`/contacts/${id}`);
  },
};
