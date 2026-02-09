'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';

export function GlobalBackground({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show background on admin pages
  const isAdminPage = pathname?.startsWith('/admin');

  return (
    <div className="relative min-h-screen">
      {/* Background Image */}
      {!isAdminPage && (
        <div className="fixed inset-0 z-0">
          <Image
            src="/images/profile/Generated Image December 16, 2025 - 1_02PM.png"
            alt="Background"
            fill
            className="object-cover object-center"
            priority
            quality={100}
            sizes="100vw"
          />
          {/* Dark overlay to make content readable */}
          <div className="absolute inset-0 bg-black/75" />
        </div>
      )}

      {/* Content */}
      <div className={isAdminPage ? '' : 'relative z-10'}>
        {children}
      </div>
    </div>
  );
}
