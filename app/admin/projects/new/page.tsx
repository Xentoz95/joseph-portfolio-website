'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to projects list (create is inline)
    router.replace('/admin/projects');
  }, [router]);

  return null;
}
