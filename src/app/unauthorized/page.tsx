'use client';

import Link from 'next/link'
import React from 'react';
import { useRouter } from 'next/navigation';

const UnAuthorizedPage = () => {
    const router = useRouter();
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded shadow-md text-center">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Unauthorized</h1>
            <p className="text-zinc-500">You do not have permission to access this page.</p>
            {/* cta */}
            <div>
                <button className="mt-6 inline-block bg-amber-500 text-white px-6 py-2 rounded hover:bg-amber-600 transition-colors" onClick={() => router.back()}>
                    Go Back
                </button>
            </div>
       </div>
    </div>
  )
}

export default UnAuthorizedPage
