import { Search } from "lucide-react";
import { Input } from "../../ui/input";

type SidebarSearchProps = {
  query: string;
  setQuery: (value: string) => void;
};

export default function SidebarSearch({ query, setQuery }: SidebarSearchProps) {
  return (
    <div>
      <div className="relative">
        <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 bg-transparent px-2 py-1 text-sm border border-emerald-200 rounded-md focus:ring-2 focus:ring-emerald-400 outline-none"
        />
      </div>
    </div>
  );
}
