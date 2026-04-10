'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { AppProvider } from '@/context/AppContext';
import DisableInspect from './DisableInspect';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AppProvider>
        {/* <DisableInspect /> */}
        {children}
      </AppProvider>
    </AuthProvider>
  );
}
