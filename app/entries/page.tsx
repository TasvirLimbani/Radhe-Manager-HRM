'use client';

import { TopNav } from '@/components/TopNav';
import { EntriesPage } from '@/components/EntriesPage';
import { useSidebar } from './layout';
import ManagerPage from '@/components/error';

export default function Page() {
  const { onToggleSidebar } = useSidebar();

  return (
    <>
      <TopNav pageTitle="Work Entries" onToggleSidebar={onToggleSidebar} />
      <div className="flex-1 overflow-y-auto p-8">
        <EntriesPage />
        {/* <ManagerPage /> */}
      </div>
    </>
  );
}
