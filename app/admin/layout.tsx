/**
 * Admin Layout
 *
 * Layout for admin pages with navigation and shared components
 */

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  Mail,
  LogOut,
  Menu
} from 'lucide-react';
import { AdminNav } from '@/components/admin/admin-nav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
