import { create } from 'zustand';
import type { Contact } from '../../types/common';
import { ContactsService } from './contacts.service';

interface ContactState {
  contacts: Contact[];
  loading: boolean;
  error?: string;
  fetchContacts: () => Promise<void>;
  addContact: (payload: Omit<Contact, 'id'>) => Promise<Contact>;
  updateContact: (id: string, payload: Partial<Contact>) => Promise<Contact>;
  removeContact: (id: string) => Promise<void>;
}

export const useContactStore = create<ContactState>((set, get) => ({
  contacts: [],
  loading: false,
  async fetchContacts() {
    set({ loading: true, error: undefined });
    try {
      const data = await ContactsService.list();
      set({ contacts: data, loading: false });
    } catch (err) {
      set({ error: (err as Error).message, loading: false });
    }
  },
  async addContact(payload) {
    const newContact = await ContactsService.create(payload);
    set({ contacts: [newContact, ...get().contacts] });
    return newContact;
  },
  async updateContact(id, payload) {
    const updated = await ContactsService.update(id, payload);
    set({ contacts: get().contacts.map((c) => (c.id === id ? updated : c)) });
    return updated;
  },
  async removeContact(id) {
    await ContactsService.remove(id);
    set({ contacts: get().contacts.filter((c) => c.id !== id) });
  },
}));
