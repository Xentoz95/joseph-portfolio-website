'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewPostPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to posts list (create is inline)
    router.replace('/admin/posts');
  }, [router]);

  return null;
}
