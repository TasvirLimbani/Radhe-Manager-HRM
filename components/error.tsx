'use client';

import { useEffect, useState } from 'react';

type User = {
  name: string;
  role: string;
};

export default function ManagerPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user (replace with real auth / API)
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <div className="p-5 text-lg">Loading...</div>;
  }

  // ❌ Not Manager
  if (!user || user.role !== 'manager') {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100">
        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
          <h1 className="text-2xl font-bold text-red-600">
            Access Denied ❌
          </h1>
          <p className="mt-2 text-gray-600">
            This page is not accessible. Your role is not ADMIN.
          </p>
        </div>
      </div>
    );
  }

  // ✅ Manager Access
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-600">
        Welcome Manager 👨‍💼
      </h1>
      <p className="mt-3 text-gray-700">
        This page is only accessible to users with the Manager role.
      </p>
    </div>
  );
}