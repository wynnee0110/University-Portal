import React from 'react';

interface Props {
    data: any[];
}

export default function AiResultTable({ data }: Props) {
    if (!data || data.length === 0) {
        return <div className="text-gray-500 italic mt-4 text-center">No results found.</div>;
    }

    // Define columns you want to hide from the UI
    const hiddenColumns = ['id', 'created_at', 'updated_at', 'uuid', 'password'];

    // Dynamically extract and filter columns
    const columns = Object.keys(data[0]).filter((col) => {
        const lowerCol = col.toLowerCase();
        // Exclude exact matches from our list, AND exclude any column ending with '_id' (like user_id, post_id)
        return !hiddenColumns.includes(lowerCol) && !lowerCol.endsWith('_id');
    });

    if (columns.length === 0) {
        return <div className="text-gray-500 italic mt-4 text-center">No displayable data found.</div>;
    }

    return (
        <div className="mt-8 overflow-x-auto shadow-md sm:rounded-lg ring-1 ring-black/5">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col}
                                scope="col"
                                className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-700 sm:pl-6 capitalize tracking-wider"
                            >
                                {col.replace(/_/g, " ")}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.map((row, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors duration-200">
                            {columns.map((col) => (
                                <td 
                                    key={col} 
                                    className="py-4 pl-4 pr-3 text-sm text-gray-600 sm:pl-6 max-w-xs truncate"
                                    title={String(row[col])} // Shows full text on hover if truncated
                                >
                                    {/* Handle nulls, booleans, dates gracefully */}
                                    {row[col] === null || row[col] === undefined
                                        ? <span className="text-gray-400">-</span>
                                        : typeof row[col] === "boolean"
                                            ? (
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${row[col] ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {row[col] ? "Yes" : "No"}
                                                </span>
                                            )
                                            : String(row[col])}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}