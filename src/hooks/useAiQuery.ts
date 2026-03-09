import { useState } from "react";
import { BACKEND_BASE_URL } from "@/constants";

/**
 * Custom hook for sending AI queries to the backend
 * Handles loading, error, and data states
 */
export function useAiQuery() {

    const [data, setData] = useState<any[]>([]);
    const [sqlQuery, setSqlQuery] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const queryAI = async (query: string) => {

        try {

            setLoading(true);
            setError(null);
            setSqlQuery(null);
            setData([]);

            const res = await fetch(`${BACKEND_BASE_URL}/ai/query`, {
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
            if (result.success !== undefined) {
                setData(result.data || []);
                setSqlQuery(result.query || null);
            } else {
                setData(result);
            }

        } catch (err: any) {

            setError(err.message || "AI request failed");

        } finally {

            setLoading(false);

        }
    };

    return {
        data,
        sqlQuery,
        loading,
        error,
        queryAI
    };
}