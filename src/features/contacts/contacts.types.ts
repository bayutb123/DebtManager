import type { Contact } from '../../types/common';

export interface ContactInput extends Omit<Contact, 'id'> {}
