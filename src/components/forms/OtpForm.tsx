"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast, ToastContainer } from "react-toastify";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { apiRequest } from "@/api/axiosInstance";

interface OtpData {
  otp: string;
  code?: string;
}

const schema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .min(4, "OTP must be at least 4 digits"),
});

const OtpForm = () => {
  const router = useRouter();
  const { verifiyOtp } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpData>({
    resolver: yupResolver(schema),
  });

  const getCode = () => {
    const code = localStorage.getItem("code");
    if (!code) {
      toast.error("Some thing went wrong");
      return;
    }

    return code;
  };

  const onSubmit = async (data: OtpData) => {
    const formData = new FormData();
    const code = getCode();
    formData.append("otp", data.otp);
    if (typeof window !== "undefined") {
      if (code) {
        formData.append("code", code);
      }
    }
    try {
      const response = await verifiyOtp(formData);
      if ((response as any)?.error) {
        toast.error(response.message || "Invalid OTP!", {
          position: "top-center",
        });
        return;
      }
      toast.success("OTP verified!", { position: "top-center" });
      router.push("/login");
    } catch (error: any) {
      toast.error("Something went wrong!", { position: "top-center" });
    }
  };

  const handleResend = async () => {
    const code = getCode();
    const formData = new FormData();
    formData.append("code", code || "");
    try {
      const response = await apiRequest({
        url: "Raising/Resend/Otp",
        method: "POST",
        data: formData,
      });
      if ((response as any)?.error) {
        toast.error(response.message || "Some thing went wrong", {
          position: "top-center",
        });
        return;
      }
      storeData(response);
      toast.success("OTP resend sucessfully", { position: "top-center" });
    } catch {
      toast.error("Failed to resend OTP", { position: "top-center" });
    }
  };

  const storeData = (res: any) => {
    localStorage.removeItem("code");
    localStorage.setItem("code", res.code);
  };

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="col-lg-12 mb-25">
          <input
            className="input"
            type="text"
            placeholder="Enter OTP"
            {...register("otp")}
          />
          <p className="form_error">{errors.otp?.message}</p>
        </div>

        <div className="d-flex align-items-center justify-content-between mb-3">
          <span>Didn’t receive the OTP?</span>
          <button type="button" className="resend-btn" onClick={handleResend}>
            Resend
          </button>
        </div>

        <button type="submit" className="tg-btn w-100">
          Verify OTP
        </button>
      </form>

      <style jsx>{`
        .form_error {
          color: red;
          font-size: 11px;
          margin: 4px 0;
        }
        .resend-btn {
          background: none;
          border: none;
          color: #316ff6;
          text-decoration: underline;
          cursor: pointer;
          font-size: 14px;
          padding: 0;
        }
      `}</style>
    </>
  );
};

export default OtpForm;
