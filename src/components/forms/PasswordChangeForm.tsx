"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/api/axiosInstance";
import * as yup from "yup";

interface PasswordData {
  password: string;
  confirmPassword: string;
}

interface PasswordChangeResponse {
  error?: boolean;
  message?: string;
}

const schema = yup.object({
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm Password is required"),
});

const PasswordChangeForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: PasswordData) => {
    try {
      setLoading(true);

      const code = localStorage.getItem("code") || "";
      const formData = new FormData();
      formData.append("code", code);
      formData.append("password", data.password);

      const response = (await apiRequest({
        url: "Raising/Forgot/Change/Password",
        method: "POST",
        data: formData,
      })) as PasswordChangeResponse;

      if (!response?.error) {
        toast.success("Password changed successfully", {
          position: "top-center",
        });
        reset();
        router.push("/");
        return;
      }

      toast.error(response?.message || "Something went wrong", {
        position: "top-center",
      });
    } catch {
      toast.error("Something went wrong", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="mh-auth-form">
      <div className="row text-white">
        <div className="col-lg-12 mb-25">
          <input
            className="mh-auth-input"
            type="password"
            placeholder="New Password"
            {...register("password")}
          />
          <p className="mh-auth-error">{errors.password?.message}</p>
        </div>

        <div className="col-lg-12 mb-25">
          <input
            className="mh-auth-input"
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          <p className="mh-auth-error">{errors.confirmPassword?.message}</p>
        </div>

        <div className="col-lg-12">
          <button type="submit" className="tg-btn w-100" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PasswordChangeForm;
