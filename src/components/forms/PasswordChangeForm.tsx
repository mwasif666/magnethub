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

      const response = await apiRequest({
        url: "Raising/Forgot/Change/Password",
        method: "POST",
        data: formData,
      });

      if (!response?.error) {
        toast.success("Password changed successfully", { position: "top-center" });
        reset();
        router.push("/");
      } else {
        toast.error(response?.message || "Something went wrong", { position: "top-center" });
      }
    } catch (error: any) {
      toast.error("Something went wrong", { position: "top-center" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="row text-white">
        <div className="col-lg-12 mb-25">
          <input
            className="input"
            type="password"
            placeholder="New Password"
            {...register("password")}
          />
          <p className="form_error">{errors.password?.message}</p>
        </div>

        <div className="col-lg-12 mb-25">
          <input
            className="input"
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          <p className="form_error">{errors.confirmPassword?.message}</p>
        </div>

        <div className="col-lg-12">
          <button type="submit" className="tg-btn w-100" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .form_error {
          color: red !important;
          font-size: 11px;
          margin: 4px 0;
        }
      `}</style>
    </form>
  );
};

export default PasswordChangeForm;
