"use client";

import React, { useEffect, useState } from "react";
import { Users, ShieldCheck, CheckCircle2, XCircle } from "lucide-react";
import { FormField } from "../ui/FormField";

interface AdminUser {
  uid: string;
  fullName: string;
  username: string;
  email: string;
  role: string;
  disabled: boolean;
  createdAt?: string | null;
}

const initialForm = {
  fullName: "",
  username: "",
  email: "",
  password: "",
  role: "staff",
};

export function AdminUserManagement() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [formData, setFormData] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<null | { type: "success" | "error"; text: string }>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (!response.ok) {
        throw new Error("Unable to load users.");
      }
      const data = await response.json();
      setUsers(data);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Unable to create user.");
      }

      setMessage({ type: "success", text: "User account created successfully." });
      setFormData(initialForm);
      await fetchUsers();
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleUserStatus = async (uid: string, disabled: boolean) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, disabled: !disabled }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Unable to update user status.");
      }

      setMessage({ type: "success", text: "User status updated successfully." });
      setUsers((prev) => prev.map((user) => (user.uid === uid ? { ...user, disabled: !disabled } : user)));
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white/90 shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">User Management</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">Create staff and manage access</h2>
            <p className="mt-1 text-sm text-slate-500">Create new marketer accounts and enable or disable existing users without leaving the dashboard.</p>
          </div>
          <div className="rounded-3xl bg-indigo-50 px-4 py-3 text-indigo-700 shadow-sm border border-indigo-100">
            <div className="text-xs uppercase tracking-[0.2em] font-semibold">Live user count</div>
            <div className="text-3xl font-bold">{users.length}</div>
          </div>
        </div>

        {message && (
          <div className={`rounded-2xl px-4 py-3 mb-6 text-sm font-medium ${message.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-rose-50 text-rose-700 border border-rose-100"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleCreateUser} className="grid gap-4 md:grid-cols-2">
          <FormField label="Full Name" name="fullName" value={formData.fullName} onChange={handleInputChange} />
          <FormField label="User ID" name="username" value={formData.username} onChange={handleInputChange} />
          <FormField label="Email" type="email" name="email" value={formData.email} onChange={handleInputChange} />
          <FormField label="Password" type="password" name="password" value={formData.password} onChange={handleInputChange} />
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
            <select name="role" value={formData.role} onChange={handleInputChange} className="w-full rounded-xl border border-slate-300 bg-white/50 px-4 py-3 text-slate-900 transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 shadow-sm">
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 items-center justify-end mt-2">
            <button type="reset" onClick={() => setFormData(initialForm)} className="w-full sm:w-auto rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors">
              Reset
            </button>
            <button type="submit" disabled={isLoading} className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 hover:from-indigo-700 hover:to-blue-700 transition-all disabled:cursor-not-allowed disabled:opacity-70">
              {isLoading ? "Creating user..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white/90 shadow-lg overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Team Access</h3>
            <p className="text-sm text-slate-500">Review all users and toggle disabled status without deleting historical reports.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-slate-600 shadow-sm border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-indigo-600" /> Secure admin workflow
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-500 uppercase text-xs tracking-[0.15em]">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Created</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {users.length ? users.map((user) => (
                <tr key={user.uid} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-900">{user.fullName} <span className="text-xs text-slate-500">({user.username})</span></td>
                  <td className="px-6 py-4 text-slate-600">{user.email}</td>
                  <td className="px-6 py-4 text-slate-600 capitalize">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${user.disabled ? "bg-rose-50 text-rose-700" : "bg-emerald-50 text-emerald-700"}`}>
                      {user.disabled ? <XCircle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      {user.disabled ? "Disabled" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}</td>
                  <td className="px-6 py-4 text-right">
                    <button type="button" onClick={() => toggleUserStatus(user.uid, user.disabled)} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition-colors">
                      {user.disabled ? "Enable" : "Disable"}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">No users found yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
