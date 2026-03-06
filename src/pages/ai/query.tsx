import React from 'react';
import AiSearchInput from '../../components/ai/aiSearchInput';
import AiResultTable from '../../components/ai/AiResultTable';
import { useAiQuery } from '../../hooks/useAiQuery';

const AiQueryPage = () => {
    const { data, loading, error, queryAI } = useAiQuery();

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-gray-50 to-white pt-12 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center">

            <div className="w-full max-w-4xl space-y-8 text-center mb-10">
                <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                    AI Database <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600">Assistant</span>
                </h1>
                <p className="text-lg text-gray-500 max-w-2xl mx-auto">
                    Ask questions about your database in plain English. For example: "Show all students" or "Find the student named John".
                </p>

                <div className="pt-4">
                    <AiSearchInput onSearch={queryAI} />
                </div>
            </div>

            <div className="w-full max-w-7xl">
                {loading && (
                    <div className="mt-12 flex flex-col items-center justify-center space-y-4 animate-pulse">
                        <div className="rounded-full h-12 w-12 border-b-2 border-indigo-600 animate-spin"></div>
                        <p className="text-gray-500 font-medium">Querying the database...</p>
                    </div>
                )}

                {error && (
                    <div className="mt-8 p-5 bg-red-50 border border-red-200 text-red-700 rounded-xl shadow-sm text-center max-w-3xl mx-auto flex items-center justify-center gap-3">
                        <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">{error}</span>
                    </div>
                )}

                {!loading && !error && data && data.length > 0 && (
                    <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <AiResultTable data={data} />
                    </div>
                )}
            </div>

        </div>
    );
};

export default AiQueryPage;