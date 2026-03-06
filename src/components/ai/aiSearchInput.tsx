import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";

interface Props {
  onSearch: (query: string) => void;
}

/**
 * Input component where admins type AI queries
 */
export default function AiSearchInput({ onSearch }: Props) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-3xl mx-auto flex items-center transition-all group">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-500 group-focus-within:text-indigo-600 transition-colors">
        <Sparkles size={20} className="mt-[-2px]" />
      </div>

      <input
        type="text"
        placeholder="Ask the AI about your database... (e.g. 'Show all students in grade 10')"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-12 pr-16 py-4 border border-gray-200 rounded-full text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm text-lg transition-shadow bg-white/80 backdrop-blur-sm"
        autoFocus
      />

      <button
        type="submit"
        disabled={!query.trim()}
        className="absolute inset-y-0 right-2 my-2 py-2 px-3 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full transition-colors shadow-sm"
        aria-label="Submit Search"
      >
        <ArrowRight size={18} />
      </button>
    </form>
  );
}