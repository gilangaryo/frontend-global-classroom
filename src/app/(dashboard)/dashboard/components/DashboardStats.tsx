import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      {/* Total Views */}
      <div className="bg-white p-5 border border-gray-300 rounded shadow-sm">
        <p className="text-2xl font-semibold">2.600</p>
        <p className="text-sm text-gray-500 my-2">Total Views</p>
        <hr className="border-t border-gray-200 mb-3" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Compare to Last Month</span>
          <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
            <ArrowUpRight size={14} /> %12
          </span>
        </div>
      </div>

      {/* Total Click */}
      <div className="bg-white p-5 border border-gray-300 rounded shadow-sm">
        <p className="text-2xl font-semibold">300</p>
        <p className="text-sm text-gray-500 my-2">Total Click</p>
        <hr className="border-t border-gray-200 mb-3" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Compare to Yesterday</span>
          <span className="flex items-center gap-1 text-green-700 bg-green-100 px-2 py-0.5 rounded-full font-medium">
            <ArrowUpRight size={14} /> %12
          </span>
        </div>
      </div>

      {/* Conversion Rate */}
      <div className="bg-white p-5 border border-gray-300 rounded shadow-sm">
        <p className="text-2xl font-semibold">11.54%</p>
        <p className="text-sm text-gray-500 my-2">Conversion Rate</p>
        <hr className="border-t border-gray-200 mb-3" />
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Compare to Yesterday</span>
          <span className="flex items-center gap-1 text-red-700 bg-red-100 px-2 py-0.5 rounded-full font-medium">
            <ArrowDownRight size={14} /> %20
          </span>
        </div>
      </div>
    </div>
  );
}
