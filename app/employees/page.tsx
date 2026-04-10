'use client';

import { TopNav } from '@/components/TopNav';
import { EmployeesPage } from '@/components/EmployeesPage';
import { useSidebar } from './layout';
import ManagerPage from '@/components/error';

export default function Page() {
  const { onToggleSidebar } = useSidebar();

  return (
    <>
      <TopNav pageTitle="Employees" onToggleSidebar={onToggleSidebar} />
      <div className="flex-1 overflow-y-auto p-8">
        <EmployeesPage />
        {/* <ManagerPage /> */}
      </div>
    </>
  );
}
