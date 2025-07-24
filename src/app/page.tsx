// FILE: app/page.tsx
'use client';

import React from 'react';
import GlobalFooter from '@/components/GlobalFooter';
import PortalPanel from '@/components/PortalPanel';
import { PORTAL_WORLDS } from '@/utils/constants';
import { generateKey } from '@/utils/helpers';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen w-full bg-atelier-dark text-atelier-light relative">
      <div className="flex flex-col md:flex-row min-h-screen">
        {PORTAL_WORLDS.map((portal, index) => (
          <PortalPanel 
            key={generateKey('portal', index)}
            href={portal.href}
            title={portal.title}
            subtitle={portal.subtitle}
            imageUrl={portal.imageUrl}
          />
        ))}
      </div>
      <GlobalFooter theme="dark" />
    </div>
  );
};

export default HomePage;
