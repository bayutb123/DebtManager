import { ContactsApi } from './contacts.api';
import type { ContactInput } from './contacts.types';

export const ContactsService = {
  list: ContactsApi.list,
  create: (payload: ContactInput) => ContactsApi.create(payload),
  update: (id: string, payload: Partial<ContactInput>) => ContactsApi.update(id, payload),
  remove: ContactsApi.remove,
};
