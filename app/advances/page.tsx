'use client';

import { TopNav } from '@/components/TopNav';
import { AdvancesPage } from '@/components/AdvancesPage';
import ManagerPage from '@/components/error';

export default function Page() {
  return (
    <>
      <TopNav pageTitle="Advances" />
      <div className="flex-1 overflow-y-auto p-8">
        {/* <AdvancesPage /> */}
        <ManagerPage />
      </div>
    </>
  );
}
