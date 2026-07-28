// === useUsers Hook ===
// Manages state for admin user list: data, loading, errors, pagination, search
import { useState, useEffect, useCallback } from "react";
import { fetchUsers, deleteUser as deleteUserApi } from "../api/adminUserApi";
import type { UserData, PaginationMeta } from "../types/user";

interface UseUsersReturn {
  users: UserData[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  search: string;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSearch: (search: string) => void;
  refetch: () => void;
  deleteUser: (id: string) => Promise<void>;
}

export const useUsers = (initialPage = 1, initialLimit = 10): UseUsersReturn => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);
  const [search, setSearch] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUsers(page, limit, search);
      setUsers(result.data);
      setMeta(result.meta);
    } catch (err: any) {
      setError(err.message || "Failed to load users");
      setUsers([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  // Refetch when page, limit, or search changes
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const refetch = useCallback(() => {
    loadUsers();
  }, [loadUsers]);

  const deleteUser = useCallback(
    async (id: string) => {
      await deleteUserApi(id);
      // Reload current page after deletion
      loadUsers();
    },
    [loadUsers]
  );

  return {
    users,
    meta,
    loading,
    error,
    page,
    limit,
    search,
    setPage,
    setLimit,
    setSearch,
    refetch,
    deleteUser,
  };
};