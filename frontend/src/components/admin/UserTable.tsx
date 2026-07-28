import type { UserData } from "../../types/user";

interface UserTableProps {
  users: UserData[];
  onEdit: (user: UserData) => void;
  onDelete: (user: UserData) => void;
  loading?: boolean;
  currentUserId?: string;
}

const roleConfig: Record<string, { label: string; bg: string; color: string }> = {
  admin: { label: "Admin", bg: "#FEF3C7", color: "#D97706" },
  user: { label: "User", bg: "#EFF6FF", color: "#2563EB" },
};

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "#ECFDF5", color: "#059669" },
  inactive: { label: "Inactive", bg: "#FEF2F2", color: "#DC2626" },
};

const SkeletonRow = () => (
  <tr style={{ borderBottom: "1px solid #F3F4F6" }}>
    {[80, 160, 70, 70, 100].map((w, i) => (
      <td key={i} style={{ padding: "14px 16px" }}>
        <div
          style={{
            height: 16,
            width: w,
            borderRadius: 8,
            background:
              "linear-gradient(90deg, #F3F4F6 25%, #E5E7EB 50%, #F3F4F6 75%)",
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      </td>
    ))}
  </tr>
);

export const UserTable = ({
  users,
  onEdit,
  onDelete,
  loading,
  currentUserId,
}: UserTableProps) => {
  if (loading) {
    return (
      <>
        <style>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
        <div
          style={{
            background: "white",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          }}
        >
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: 600,
              }}
            >
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    background: "#F9FAFB",
                    borderBottom: "2px solid #E5E7EB",
                  }}
                >
                  {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      style={{
                        padding: "14px 16px",
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#6B7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <SkeletonRow key={i} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div
        style={{
          padding: 60,
          textAlign: "center",
          background: "white",
          borderRadius: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            background: "#F3F4F6",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
          }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#111827",
            margin: "0 0 4px",
          }}
        >
          No users found
        </h3>
        <p
          style={{
            fontSize: 14,
            color: "#6B7280",
            margin: 0,
            lineHeight: 1.5,
          }}
        >
          There are no users matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: 16,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 600,
          }}
        >
          <thead>
            <tr
              style={{
                textAlign: "left",
                background: "#F9FAFB",
                borderBottom: "2px solid #E5E7EB",
              }}
            >
              {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                <th
                  key={h}
                  style={{
                    padding: "14px 16px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#6B7280",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {users.map((user) => {
              const role = roleConfig[user.role] || roleConfig.user;
              const status = statusConfig[user.status || "active"] || statusConfig.active;
              const isCurrentUser = user.id === currentUserId;

              return (
                <tr
                  key={user.id}
                  style={{
                    borderBottom: "1px solid #F3F4F6",
                    transition: "background 0.15s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#F9FAFB")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <td
                    style={{
                      padding: "14px 16px",
                      fontWeight: 500,
                      color: "#111827",
                    }}
                  >
                    {user.name}
                  </td>
                  <td
                    style={{
                      padding: "14px 16px",
                      color: "#6B7280",
                      fontSize: 14,
                    }}
                  >
                    {user.email}
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        background: role.bg,
                        color: role.color,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {role.label}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "4px 10px",
                        borderRadius: 8,
                        fontSize: 11,
                        fontWeight: 600,
                        background: status.bg,
                        color: status.color,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td style={{ padding: "14px 16px" }}>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => onEdit(user)}
                        style={{
                          padding: "6px 12px",
                          background: "#EFF6FF",
                          color: "#2563EB",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: "pointer",
                          fontFamily: "inherit",
                          transition: "background 0.2s",
                        }}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.background = "#DBEAFE")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.background = "#EFF6FF")
                        }
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => onDelete(user)}
                        disabled={isCurrentUser}
                        style={{
                          padding: "6px 12px",
                          background: isCurrentUser ? "#F3F4F6" : "#FEF2F2",
                          color: isCurrentUser ? "#9CA3AF" : "#DC2626",
                          border: "none",
                          borderRadius: 8,
                          fontSize: 13,
                          fontWeight: 600,
                          cursor: isCurrentUser ? "not-allowed" : "pointer",
                          fontFamily: "inherit",
                          transition: "background 0.2s",
                        }}
                        onMouseOver={(e) => {
                          if (!isCurrentUser)
                            e.currentTarget.style.background = "#FEE2E2";
                        }}
                        onMouseOut={(e) => {
                          if (!isCurrentUser)
                            e.currentTarget.style.background = "#FEF2F2";
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
