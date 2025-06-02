import React from 'react';

const ProductRowSkeleton = () => {
  return (
    <tr className="animate-pulse">
      <td className="px-5 py-4 border-b border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
      </td>
      <td className="px-5 py-4 border-b border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </td>
      <td className="px-5 py-4 border-b border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
      </td>
      <td className="px-5 py-4 border-b border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
      </td>
      <td className="px-5 py-4 border-b border-gray-200">
        <div className="h-4 bg-gray-300 rounded w-20"></div>
      </td>
      <td className="px-5 py-4 border-b border-gray-200 text-center">
        <div className="flex justify-center space-x-2">
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
          <div className="h-8 w-8 bg-gray-300 rounded"></div>
        </div>
      </td>
    </tr>
  );
};

export default ProductRowSkeleton;