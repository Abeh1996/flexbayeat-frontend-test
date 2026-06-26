import { CheckCircle } from 'lucide-react'
import React from 'react'
import Link from 'next/link'

const LogoutSuccessPage = () => {
  return (
    <div>
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md text-center">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h1 className="text-2xl font-bold mb-4">You have successfully logout.</h1>
                <p className="text-gray-600">Thanks for using our service, come back soon. </p>

                {/* cta */}
                <div>
                    <Link href="/" className="mt-6 inline-block bg-amber-500 text-white px-6 py-2 rounded hover:bg-amber-600 transition-colors">
                        Go to Home
                    </Link>
                </div>
                </div>
            </div> 
    </div>
  )
}

export default LogoutSuccessPage
