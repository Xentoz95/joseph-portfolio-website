'use client';

/**
 * Admin Dashboard Page
 *
 * Main admin dashboard with statistics and quick navigation
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { AdminAuth } from '@/components/admin/admin-auth';
import {
  FolderKanban,
  FileText,
  Mail,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
  projects: {
    total: number;
    published: number;
    drafts: number;
  };
  posts: {
    total: number;
    published: number;
    drafts: number;
  };
  contacts: {
    total: number;
    unread: number;
  };
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminAuth>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome to your content management dashboard
          </p>
        </div>

        {/* Stats Grid */}
        {loading ? (
          <div className="grid gap-6 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-20" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : stats ? (
          <div className="grid gap-6 md:grid-cols-3">
            {/* Projects Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Projects
                </CardTitle>
                <FolderKanban className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.projects.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">{stats.projects.published} published</span>
                  {' • '}
                  {stats.projects.drafts} drafts
                </p>
                <Link href="/admin/projects">
                  <Button variant="ghost" size="sm" className="mt-4 w-full">
                    Manage Projects
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Posts Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Blog Posts
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.posts.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  <span className="text-green-600 font-medium">{stats.posts.published} published</span>
                  {' • '}
                  {stats.posts.drafts} drafts
                </p>
                <Link href="/admin/posts">
                  <Button variant="ghost" size="sm" className="mt-4 w-full">
                    Manage Posts
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Contacts Card */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Contact Messages
                </CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.contacts.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.contacts.unread > 0 ? (
                    <Badge variant="default" className="mt-1">
                      {stats.contacts.unread} unread
                    </Badge>
                  ) : (
                    <span className="text-green-600 font-medium">All read</span>
                  )}
                </p>
                <Link href="/admin/contact">
                  <Button variant="ghost" size="sm" className="mt-4 w-full">
                    View Messages
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ) : null}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Link href="/admin/projects/new">
                <Button variant="outline" className="w-full justify-start">
                  <FolderKanban className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </Link>
              <Link href="/admin/posts/new">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  New Post
                </Button>
              </Link>
              <Link href="/admin/contact">
                <Button variant="outline" className="w-full justify-start">
                  <Mail className="mr-2 h-4 w-4" />
                  View Messages
                </Button>
              </Link>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => window.location.href = '/'}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                View Site
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminAuth>
  );
}
