"use client";
import { useDispatch, useSelector } from "react-redux";
import { searchUsers, UserListItem } from "@/redux/thunk/userThunk";
import { setSelectedUser } from "@/redux/slices/chatSlice";
import { RootState, AppDispatch } from "@/redux/store";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { useEffect } from "react";

type Props = {
  query: string;
  onSelectConversation: (userId: string) => void;
};

export default function SearchResults({ query, onSelectConversation }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { results, loading } = useSelector((state: RootState) => state.search);
 // Search users
  useEffect(() => {
    if (!query) return;
    const timer = setTimeout(() => {
      dispatch(searchUsers({ search: query }));
    }, 400);
    return () => clearTimeout(timer);
  }, [query, dispatch]);

  
  const handleSelectUser = (user: UserListItem) => {
    dispatch(setSelectedUser(user));
    onSelectConversation(user.id);
    // setQuery("");
  };

  if (!query) return null;

  return (
    <div className="mt-2">
      {loading && <p className="text-sm text-gray-400">Searching...</p>}
      {!loading && results.length > 0 && (
        <ul className="max-h-48 overflow-y-auto bg-white rounded-lg border shadow">
          {results.map((u) => (
            <li
              key={u.id}
              onClick={() => handleSelectUser(u)}
              className="px-3 py-2 hover:bg-green-50 cursor-pointer"
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={u.profile_pic_url || undefined}
                  alt={u.name}
                />
                <AvatarFallback>{u.name?.[0] || "?"}</AvatarFallback>
              </Avatar>
              {u.name}
            </li>
          ))}
        </ul>
      )}
      {!loading && results.length === 0 && (
        <p className="text-sm text-gray-400">No users found</p>
      )}
    </div>
  );
}
