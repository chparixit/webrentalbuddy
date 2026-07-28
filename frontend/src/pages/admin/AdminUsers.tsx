import { useMemo, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { createUser, updateUser } from "../../api/adminUserApi";
import { useUsers } from "../../hooks/useUsers";
import { LoadingSpinner } from "../../components/LoadingSpinner";
import { EmptyState } from "../../components/EmptyState";
import { showToast } from "../../components/Toast";
import { UserSearch } from "../../components/admin/UserSearch";
import { UserTable } from "../../components/admin/UserTable";
import { UserFormModal } from "../../components/admin/UserFormModal";
import { DeleteUserModal } from "../../components/admin/DeleteUserModal";
import { Pagination } from "../../components/admin/Pagination";
import type { UserData, CreateUserPayload, UpdateUserPayload } from "../../types/user";

interface AdminUsersProps {
  onBack: () => void;
}

export const AdminUsers = ({ onBack }: AdminUsersProps) => {
  const { user: currentUser } = useAuth();
  const { users, meta, loading, error, search, setSearch, refetch, deleteUser } = useUsers();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null);

  const activeUsers = useMemo(
    () => users.filter((user) => user.status !== "inactive").length,
    [users]
  );

  const handleCreate = async (payload: {
    name: string;
    email: string;
    password?: string;
    role: string;
    status: string;
  }) => {
    const userId = selectedUser?.id || selectedUser?._id;
    if (userId) {
      const updatePayload: UpdateUserPayload = {
        name: payload.name,
        email: payload.email,
        password: payload.password || undefined,
        role: payload.role as "user" | "admin",
      };
      await updateUser(userId, updatePayload);
      showToast("User updated successfully", "success");
    } else {
      const createPayload: CreateUserPayload = {
        name: payload.name,
        email: payload.email,
        password: payload.password || "",
        role: payload.role as "user" | "admin",
      };
      await createUser(createPayload);
      showToast("User created successfully", "success");
    }

    setIsFormOpen(false);
    setSelectedUser(null);
    refetch();
  };

  const handleDelete = async () => {
    if (!deleteTarget?.id) {
      return;
    }

    await deleteUser(deleteTarget.id);
    showToast("User deleted successfully", "success");
    setDeleteTarget(null);
  };

  return (
    <div style={{ padding: "40px 80px", maxWidth: 1280, margin: "0 auto" }}>
      <button
        onClick={onBack}
        style={{
          background: "none",
          border: "none",
          color: "#2563EB",
          cursor: "pointer",
          fontSize: 14,
          marginBottom: 20,
          fontFamily: "inherit",
        }}
      >
        ← Back to Admin Panel
      </button>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 24,
          marginBottom: 24,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ margin: "0 0 8px", fontSize: 28, fontWeight: 700, color: "#111827" }}>
            User Management
          </h1>
          <p style={{ margin: 0, color: "#6B7280", fontSize: 15 }}>
            Manage tenant and admin accounts across RentalBuddy Kathmandu Valley.
          </p>
        </div>

        <button
          onClick={() => {
            setSelectedUser(null);
            setIsFormOpen(true);
          }}
          style={{
            padding: "12px 20px",
            background: "#2563EB",
            color: "white",
            border: "none",
            borderRadius: 12,
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Add User
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
          marginBottom: 24,
        }}
      >
        {[
          { label: "Visible Users", value: users.length, accent: "#2563EB", bg: "#EFF6FF" },
          { label: "Active Users", value: activeUsers, accent: "#059669", bg: "#ECFDF5" },
          { label: "Admins", value: users.filter((item) => item.role === "admin").length, accent: "#7C3AED", bg: "#F5F3FF" },
        ].map((item) => (
          <div
            key={item.label}
            style={{
              background: "white",
              borderRadius: 18,
              padding: 20,
              boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 12,
                background: item.bg,
                color: item.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 700,
                marginBottom: 14,
              }}
            >
              {String(item.value).padStart(2, "0")}
            </div>
            <p style={{ margin: "0 0 6px", color: "#6B7280", fontSize: 13 }}>{item.label}</p>
            <p style={{ margin: 0, color: "#111827", fontSize: 24, fontWeight: 700 }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 24,
          boxShadow: "0 12px 32px rgba(15, 23, 42, 0.07)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          <UserSearch value={search} onChange={setSearch} />
          <button
            onClick={refetch}
            style={{
              padding: "10px 16px",
              borderRadius: 10,
              border: "1px solid #E5E7EB",
              background: "white",
              cursor: "pointer",
              fontFamily: "inherit",
              fontWeight: 600,
            }}
          >
            Refresh
          </button>
        </div>

        {loading && <LoadingSpinner text="Loading users..." />}

        {!loading && error && (
          <EmptyState
            title="Unable to load users"
            description={error}
            action={{ label: "Retry", onClick: refetch }}
          />
        )}

        {!loading && !error && users.length === 0 && (
          <EmptyState
            title="No users found"
            description="Create the first user account or adjust the current search query."
            action={{
              label: "Create User",
              onClick: () => {
                setSelectedUser(null);
                setIsFormOpen(true);
              },
            }}
          />
        )}

        {!loading && !error && users.length > 0 && (
          <>
            <UserTable
              users={users}
              onEdit={(user) => {
                setSelectedUser(user);
                setIsFormOpen(true);
              }}
              onDelete={setDeleteTarget}
              currentUserId={currentUser?.id}
            />
            {meta && <Pagination meta={meta} onPageChange={() => refetch()} />}
          </>
        )}
      </div>

      <UserFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={handleCreate}
        user={selectedUser}
      />

      <DeleteUserModal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        userName={deleteTarget?.name || "this user"}
      />
    </div>
  );
};
