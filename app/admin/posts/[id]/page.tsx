'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to posts list (edit is inline)
    router.replace('/admin/posts');
  }, [router]);

  return null;
}
