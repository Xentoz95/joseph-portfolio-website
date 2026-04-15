/**
 * Admin Layout
 *
 * Layout for admin pages with responsive sidebar navigation
 */

import { AdminNav } from '@/components/admin/admin-nav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminNav />
      {/* Main content - starts below fixed header (pt-16) and has left margin for sidebar (lg:pl-64) */}
      <main className="pt-16 lg:pl-64 min-h-screen">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
