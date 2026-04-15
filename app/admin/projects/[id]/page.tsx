'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProjectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to projects list (edit is inline)
    router.replace('/admin/projects');
  }, [router]);

  return null;
}
