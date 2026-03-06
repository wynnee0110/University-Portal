import { useState } from "react";

/**
 * Custom hook for sending AI queries to the backend
 * Handles loading, error, and data states
 */
export function useAiQuery() {

    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryAI = async (query: string) => {

        try {

            setLoading(true);
            setError(null);

            const res = await fetch("http://localhost:8000/api/ai/query", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query })
            });

            if (!res.ok) {
                throw new Error(`Error: ${res.statusText}`);
            }

            const result = await res.json();
            setData(result);

        } catch (err: any) {

            setError(err.message || "AI request failed");

        } finally {

            setLoading(false);

        }
    };

    return {
        data,
        loading,
        error,
        queryAI
    };
}