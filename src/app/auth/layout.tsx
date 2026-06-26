// src/app/(auth)/layout.tsx
import { AuthLayoutShell } from '@/features/Auth/components/AuthLayoutShell';
import React from 'react';

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthLayoutShell>
      {children}
    </AuthLayoutShell>
  );
};

export default AuthLayout;