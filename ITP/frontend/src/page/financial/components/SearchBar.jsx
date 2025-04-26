// import React from 'react';

// const SearchBar = ({ value, onChange, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }) => (
//   <div>
//     <input
//       type="text"
//       placeholder="Search by category or description..."
//       value={value}
//       onChange={(e) => onChange(e.target.value)}
//       className="p-2 mb-4 border border-gray-300 rounded w-full"
//     />
//     <div className="flex gap-4 my-4">
//       <select
//         value={selectedMonth}
//         onChange={e => setSelectedMonth(e.target.value)}
//         className="border px-2 py-1 rounded"
//       >
//         <option value="">All Months</option>
//         {[...Array(12)].map((_, i) => (
//           <option key={i} value={String(i + 1).padStart(2, '0')}>
//             {new Date(0, i).toLocaleString('default', { month: 'long' })}
//           </option>
//         ))}
//       </select>

//       <select
//         value={selectedYear}
//         onChange={e => setSelectedYear(e.target.value)}
//         className="border px-2 py-1 rounded"
//       >
//         <option value="">All Years</option>
//         {[2024, 2025, 2026].map(year => (
//           <option key={year} value={year}>{year}</option>
//         ))}
//       </select>
//     </div>
//   </div>
// );


// export default SearchBar;

import React from 'react';

const SearchBar = ({ value, onChange, selectedMonth, setSelectedMonth, selectedYear, setSelectedYear }) => (
  <div className="bg-white shadow-md rounded-lg p-6 mb-6">
    <input
      type="text"
      placeholder="🔍 Search by category or description..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="p-3 mb-4 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
    <div className="flex gap-4 my-4">
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Month</label>
        <select
          value={selectedMonth}
          onChange={e => setSelectedMonth(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Months</option>
          {[...Array(12)].map((_, i) => (
            <option key={i} value={String(i + 1).padStart(2, '0')}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Year</label>
        <select
          value={selectedYear}
          onChange={e => setSelectedYear(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Years</option>
          {[2024, 2025, 2026].map(year => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>
      </div>
    </div>
  </div>
);

export default SearchBar;