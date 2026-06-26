import Link from "next/link";
import React from "react";

const BuyerOrdersPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
      
      No orders yet. Start shopping to see your orders here!
      <Link
        href="/restaurants"
        className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition w-fit"
      >
        <span>Browse Meals</span>
      </Link>
    </div>
  );
};

export default BuyerOrdersPage;
