'use client';

/**
 * Admin Contact Page - Local JSON Based
 *
 * View and manage contact submissions without coding!
 */

import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AdminAuth } from '@/components/admin/admin-auth';
import { Mail, Phone, Trash2, Eye, Check, RefreshCw } from 'lucide-react';

// Contact type
interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  created_at: string;
}

// Load contacts from API
async function loadContacts(): Promise<Contact[]> {
  try {
    const response = await fetch('/api/contacts');
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    console.error('Error loading contacts:', e);
  }
  return [];
}

// Save contacts to local JSON
async function saveContacts(contacts: Contact[]): Promise<boolean> {
  try {
    const response = await fetch('/api/contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contacts),
    });
    return response.ok;
  } catch (e) {
    console.error('Error saving contacts:', e);
    return false;
  }
}

export default function AdminContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const fetchContacts = async () => {
    setLoading(true);
    const data = await loadContacts();
    setContacts(data);
    setLoading(false);
  };

  const handleMarkAsRead = async (id: string) => {
    const updatedContacts = contacts.map(c =>
      c.id === id ? { ...c, read: true } : c
    );
    const success = await saveContacts(updatedContacts);
    if (success) {
      setContacts(updatedContacts);
      toast({
        title: 'Success',
        description: 'Marked as read',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to mark as read',
        variant: 'destructive',
      });
    }
  };

  const handleMarkAllAsRead = async () => {
    const updatedContacts = contacts.map(c => ({ ...c, read: true }));
    const success = await saveContacts(updatedContacts);
    if (success) {
      setContacts(updatedContacts);
      toast({
        title: 'Success',
        description: 'All marked as read',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to mark all as read',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }
    const updatedContacts = contacts.filter(c => c.id !== id);
    const success = await saveContacts(updatedContacts);
    if (success) {
      setContacts(updatedContacts);
      toast({
        title: 'Success',
        description: 'Contact deleted',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete contact',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAllRead = async () => {
    const unreadContacts = contacts.filter(c => !c.read);
    if (unreadContacts.length === contacts.length) {
      toast({
        title: 'Error',
        description: 'No read messages to delete',
        variant: 'destructive',
      });
      return;
    }
    if (!confirm(`Delete ${contacts.length - unreadContacts.length} read messages?`)) {
      return;
    }
    const success = await saveContacts(unreadContacts);
    if (success) {
      setContacts(unreadContacts);
      toast({
        title: 'Success',
        description: 'Read messages deleted',
      });
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete',
        variant: 'destructive',
      });
    }
  };

  const filteredContacts = filter === 'unread'
    ? contacts.filter(c => !c.read)
    : contacts;

  const unreadCount = contacts.filter(c => !c.read).length;

  return (
    <AdminAuth>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Contact Submissions</h1>
            <p className="text-muted-foreground mt-1">
              Manage messages from your contact form - {unreadCount} unread
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All ({contacts.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchContacts}
              disabled={loading}
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
              >
                <Check className="mr-2 h-4 w-4" />
                Mark All Read
              </Button>
            )}
            {contacts.some(c => c.read) && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteAllRead}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Read
              </Button>
            )}
          </div>
        </div>

        {/* Contacts List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading contacts...</p>
          </div>
        ) : filteredContacts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                {filter === 'unread' ? 'No unread messages' : 'No contact submissions yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredContacts.map((contact) => (
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
                          className="flex items-center gap-1 hover:text-primary transition"
                        >
                          <Mail className="w-3 h-3" />
                          {contact.email}
                        </a>
                        {contact.phone && (
                          <>
                            <span>•</span>
                            <a
                              href={`tel:${contact.phone}`}
                              className="flex items-center gap-1 hover:text-primary transition"
                            >
                              <Phone className="w-3 h-3" />
                              {contact.phone}
                            </a>
                          </>
                        )}
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
                          <Eye className="mr-2 h-4 w-4" />
                          Mark Read
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(contact.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
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

        {/* Summary */}
        {contacts.length > 0 && (
          <Card className="bg-muted/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Total: {contacts.length} messages</span>
                <span>Unread: {unreadCount}</span>
                <span>Read: {contacts.length - unreadCount}</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminAuth>
  );
}
