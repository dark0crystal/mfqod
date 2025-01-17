"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.string().min(1, "Email is required").max(50, "Email is too long"),
});
type FormFields = z.infer<typeof schema>;

export default function ManageUsers() {
  const { register, reset, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormFields>({
    resolver: zodResolver(schema),
  });
  const [users, setUsers] = useState<any[]>([]); // State to store fetched users
  const [error, setFetchError] = useState<string | null>(null);

  const fetchUsers = async (email: string) => {
    try {
      const response = await fetch(`/api/manage-users?userEmail=${email}`);
      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }
      const data = await response.json();
      setUsers(data);
      setFetchError(null);
    } catch (error: any) {
      setUsers([]);
      setFetchError(error.message || "Error fetching users.");
    }
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    await fetchUsers(data.email);
    reset(); // Reset the form
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <input
          type="text"
          {...register("email")}
          className="border p-2 rounded w-full mb-2"
          placeholder="Search by email"
        />
        {errors.email && <div className="text-red-400">{errors.email.message}</div>}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-4 py-2 rounded ${isSubmitting ? "bg-gray-400" : "bg-blue-600 text-white"}`}
        >
          {isSubmitting ? "Searching..." : "Search"}
        </button>
      </form>

      {/* Error Message */}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {/* Results */}
      {users.length > 0 ? (
        <div>
          <h2 className="text-lg font-bold mb-2">Results:</h2>
          <ul className="list-disc pl-5">
            {users.map((user) => (
              <li key={user.id}>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.name || "N/A"}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500">No users found.</p>
      )}
    </div>
  );
}
