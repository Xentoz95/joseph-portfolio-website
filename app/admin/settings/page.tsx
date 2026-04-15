'use client';

/**
 * Admin Settings Page
 *
 * Change admin password and other settings
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AdminAuth } from '@/components/admin/admin-auth';
import { toast } from '@/hooks/use-toast';
import { Settings, Eye, EyeOff, Save, Lock, AlertCircle } from 'lucide-react';

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordChanged, setPasswordChanged] = useState(false);

  // Load current custom password from localStorage
  const [savedPassword, setSavedPassword] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('admin-custom-password');
    setSavedPassword(saved);
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast({
        title: 'Error',
        description: 'Please enter your current password',
        variant: 'destructive',
      });
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'New password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    // Simulate a small delay for UX
    await new Promise(resolve => setTimeout(resolve, 500));

    // Save new password to localStorage
    localStorage.setItem('admin-custom-password', newPassword);

    // Also update the main password in auth
    localStorage.setItem('admin-password', newPassword);

    setLoading(false);
    setPasswordChanged(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');

    toast({
      title: 'Success',
      description: 'Password changed successfully!',
    });

    // Clear success message after 3 seconds
    setTimeout(() => setPasswordChanged(false), 3000);
  };

  return (
    <AdminAuth>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your admin account and preferences
          </p>
        </div>

        {/* Password Change Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Change Password
            </CardTitle>
            <CardDescription>
              Update your admin dashboard password. This password is stored locally on your device.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <Label htmlFor="current">Current Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="current"
                    type={showPasswords ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="pr-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="new">New Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="new"
                    type={showPasswords ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    className="pr-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirm">Confirm New Password</Label>
                <div className="relative mt-1">
                  <Input
                    id="confirm"
                    type={showPasswords ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pr-10"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswords(!showPasswords)}
                >
                  {showPasswords ? (
                    <>
                      <EyeOff className="h-4 w-4 mr-2" />
                      Hide Passwords
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4 mr-2" />
                      Show Passwords
                    </>
                  )}
                </Button>
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                  {loading ? (
                    'Saving...'
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Change Password
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <AlertCircle className="h-5 w-5" />
              Important Note
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
            <p>
              <strong>Current password:</strong> The system checks your saved password first, then falls back to the environment password.
            </p>
            <p>
              <strong>To change the environment password permanently</strong> (for all devices), edit the <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">NEXT_PUBLIC_ADMIN_PASSWORD</code> value in your <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">.env.local</code> file and restart the server.
            </p>
            <p className="pt-2">
              <strong>Current saved password:</strong> {savedPassword ? 'Custom password set' : 'Using default environment password'}
            </p>
          </CardContent>
        </Card>
      </div>
    </AdminAuth>
  );
}
