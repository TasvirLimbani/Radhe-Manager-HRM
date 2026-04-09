'use client';

import { TopNav } from '@/components/TopNav';
import { EmployeesPage } from '@/components/EmployeesPage';
import ManagerPage from '@/components/error';

export default function Page() {
  return (
    <>
      <TopNav pageTitle="Employees" />
      <div className="flex-1 overflow-y-auto p-8">
        {/* <EmployeesPage /> */}
        <ManagerPage />
      </div>
    </>
  );
}
