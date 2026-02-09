'use client';

/**
 * Admin Contact Page
 *
 * Protected admin page to view and manage contact submissions
 * Simple password protection via environment variable
 */

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminAuth } from '@/components/admin/admin-auth';
import {
  adminGetContacts,
  adminMarkAsRead,
  adminDeleteContact,
} from './actions';
import type { Contact } from '@/types/database';

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // Fetch contacts when authenticated
  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const data = await adminGetContacts({ unreadOnly: filter === 'unread' });
      setContacts(data);
    } catch (error) {
      toast.error('Failed to load contacts');
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await adminMarkAsRead(id);
      toast.success('Marked as read');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to mark as read');
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      await adminDeleteContact(id);
      toast.success('Contact deleted');
      fetchContacts();
    } catch (error) {
      toast.error('Failed to delete contact');
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <AdminAuth>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contact Submissions</h1>
            <p className="text-muted-foreground mt-1">
              Manage messages from your contact form
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              All
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              onClick={() => setFilter('unread')}
            >
              Unread
            </Button>
            <Button variant="outline" onClick={fetchContacts} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        {/* Contacts List */}
        {contacts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {filter === 'unread' ? 'No unread messages' : 'No contact submissions yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className={!contact.read ? 'border-primary' : ''}>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <CardTitle className="text-xl">{contact.name}</CardTitle>
                        {!contact.read && (
                          <Badge variant="default" className="ml-2">
                            New
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-2 flex-wrap">
                        <a
                          href={`mailto:${contact.email}`}
                          className="hover:text-primary transition"
                        >
                          {contact.email}
                        </a>
                        <span>•</span>
                        <span className="text-xs">
                          {new Date(contact.created_at).toLocaleString()}
                        </span>
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {!contact.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsRead(contact.id)}
                        >
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(contact.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-foreground whitespace-pre-wrap break-words">
                      {contact.message}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminAuth>
  );
}
