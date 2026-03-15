import { useEffect } from 'react';
import { useContactStore } from '../contacts.store';
import ContactForm from '../components/ContactForm';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Table, THead, TBody, TH, TD } from '../../../components/ui/table';
import LoadingState from '../../../components/shared/LoadingState';
import EmptyState from '../../../components/shared/EmptyState';

const ContactsPage = () => {
  const { contacts, fetchContacts, addContact, removeContact, loading } = useContactStore();

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  if (loading) return <LoadingState label="Loading contacts..." />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Contacts</h2>
          <p className="text-sm text-slate-500">People involved in your debts and receivables.</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Add contact</CardTitle>
          </CardHeader>
          <CardContent>
            <ContactForm
              onSubmit={async (values) => {
                await addContact(values);
              }}
            />
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>All contacts</CardTitle>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <EmptyState title="No contacts yet" description="Add a contact to start tracking." />
            ) : (
              <Table>
                <THead>
                  <tr>
                    <TH>Name</TH>
                    <TH>Phone</TH>
                    <TH>Notes</TH>
                    <TH>Actions</TH>
                  </tr>
                </THead>
                <TBody>
                  {contacts.map((contact) => (
                    <tr key={contact.id} className="hover:bg-slate-50">
                      <TD className="font-semibold text-slate-900">{contact.name}</TD>
                      <TD>{contact.phone}</TD>
                      <TD className="text-sm text-slate-600">{contact.notes}</TD>
                      <TD>
                        <Button
                          variant="ghost"
                          className="px-2 py-1 text-xs text-rose-600"
                          onClick={() => removeContact(contact.id)}
                        >
                          Delete
                        </Button>
                      </TD>
                    </tr>
                  ))}
                </TBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContactsPage;
