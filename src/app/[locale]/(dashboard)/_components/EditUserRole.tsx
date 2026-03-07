"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { gooeyToast } from "goey-toast";
import DataProvider from "@/app/storage";
import CustomSelect from "@/components/ui/CustomSelect";

type UserRoleForm = {
  role: string;
};

export default function EditUserRole({ userId }: { userId: string }) {
  const [currentRole, setCurrentRole] = useState<string | null>(null);

  const { roles } = DataProvider();

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserRoleForm>();

  useEffect(() => {
    async function fetchRolesAndUserRole() {
      try {
        const userRoleResponse = await fetch(`/api/get-role?userId=${userId}`);
        if (!userRoleResponse.ok) throw new Error("Failed to fetch user role");
        const userRoleData = await userRoleResponse.json();
        setCurrentRole(userRoleData.role);
        setValue("role", userRoleData.role);
      } catch {
        gooeyToast.error("Failed to load user role.");
      }
    }

    fetchRolesAndUserRole();
  }, [userId, setValue]);

  const onSubmit = async (data: UserRoleForm) => {
    try {
      const response = await fetch("/api/manage-role", {
        method: "PUT",
        body: JSON.stringify({ userId, role: data.role }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to update user role");

      gooeyToast.success("User role updated.");
    } catch {
      gooeyToast.error("Failed to update user role.");
    }
  };

  return (
    <div>
      <h1 className="text-lg font-bold">Edit User Role</h1>
      {currentRole && (
        <p className="mb-4">
          Current Role: <strong>{currentRole}</strong>
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Controller
            name="role"
            control={control}
            rules={{ required: "Please select a role" }}
            render={({ field }) => (
              <CustomSelect
                id="role"
                label="Role"
                value={field.value ?? ""}
                onChange={field.onChange}
                placeholder="Select Role"
                options={[
                  { value: "", label: "Select Role" },
                  ...roles.map((role) => ({ value: role, label: role })),
                ]}
              />
            )}
          />
          {errors.role && (
            <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? "Submitting..." : "Update Role"}
        </button>
      </form>
    </div>
  );
}
