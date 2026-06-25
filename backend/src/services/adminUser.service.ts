// === Admin User Management Service ===
// Handles business logic for admin CRUD operations on users
import User from "../models/User";
import bcrypt from "bcrypt";

type UserRole = "admin" | "user";
type UserStatus = "active" | "inactive";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface GetUsersOptions {
  page: number;
  limit: number;
  search?: string;
}

export const getUsers = async (options: GetUsersOptions) => {
  const { page, limit, search } = options;
  const skip = (page - 1) * limit;

  // Build search filter: match against BOTH name and email
  let filter: any = {};
  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter = {
      $or: [{ name: regex }, { email: regex }],
    };
  }

  const [users, total] = await Promise.all([
    User.find(filter)
      .select("-password") // never expose passwords
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    User.countDocuments(filter),
  ]);

  const meta: PaginationMeta = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
  };

  return { data: users, meta };
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id).select("-password");
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

export const createUser = async (userData: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  status?: UserStatus;
}) => {
  // Check if email already exists
  const existing = await User.findOne({ email: userData.email });
  if (existing) {
    throw new Error("Email already exists");
  }

  // Hash password before saving
  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password: hashedPassword,
    role: userData.role ?? "user",
    status: userData.status ?? "active",
  });

  // Return user without password using toJSON()
  const userJson = user.toJSON();
  const { password, ...userWithoutPassword } = userJson;
  return userWithoutPassword;
};

export const updateUser = async (
  id: string,
  updateData: {
    name?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    status?: UserStatus;
  }
) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  // Validate password length if provided
  if (updateData.password && updateData.password.length < 6) {
    throw new Error("Password must be at least 6 characters");
  }

  // If updating email, check it's not taken by another user
  if (updateData.email && updateData.email !== user.email) {
    const existing = await User.findOne({ email: updateData.email });
    if (existing) {
      throw new Error("Email already in use");
    }
  }

  // Build update object with type-safe approach for enum fields
  const updateFields: Record<string, any> = {};
  if (updateData.name !== undefined) updateFields.name = updateData.name;
  if (updateData.email !== undefined) updateFields.email = updateData.email;
  if (updateData.role !== undefined) updateFields.role = updateData.role;
  if (updateData.status !== undefined) updateFields.status = updateData.status;
  if (updateData.password) {
    updateFields.password = await bcrypt.hash(updateData.password, 10);
  }

  const updatedUser = await User.findByIdAndUpdate(id, updateFields, {
    new: true,
    runValidators: true,
  }).select("-password");

  return updatedUser;
};

export const deleteUser = async (id: string) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error("User not found");
  }

  // Prevent deleting the last admin
  if (user.role === "admin") {
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount <= 1) {
      throw new Error("Cannot delete the last admin account");
    }
  }

  await User.findByIdAndDelete(id);
  return { message: "User deleted successfully" };
};