"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/api/axiosInstance";
import { useState } from "react";

interface OtpData {
  otp: string;
  code?: string;
}

interface PasswordOtpResponse {
  error?: boolean;
  message?: string;
  code?: string;
}

const schema = yup.object({
  otp: yup
    .string()
    .required("OTP is required")
    .min(4, "OTP must be at least 4 digits"),
});

type MessageType = "success" | "error" | "info";

const PasswordOtpForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<OtpData>({
    resolver: yupResolver(schema),
  });

  const [otpResendLoading, setOtpResendLoading] = useState(false);
  const [otpVerifyLoading, setOtpVerifyLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>("info");

  const getCode = () => {
    const code = localStorage.getItem("code");
    if (!code) {
      setMessageType("error");
      setMessage("Something went wrong. Please try again.");
      return;
    }

    return code;
  };

  const onSubmit = async (data: OtpData) => {
    const code = getCode();
    if (!code) return;

    const formData = new FormData();
    formData.append("otp", data.otp);
    formData.append("code", code);

    try {
      setOtpVerifyLoading(true);
      setMessage(null);

      const response = (await apiRequest({
        url: "Raising/Forgot/Check/Otp",
        method: "POST",
        data: formData,
      })) as PasswordOtpResponse;

      if (response?.error) {
        setMessageType("error");
        setMessage(response.message || "Invalid OTP!");
        return;
      }

      setMessageType("success");
      setMessage("OTP verified successfully!");
      router.push("/change-password");
    } catch {
      setMessageType("error");
      setMessage("Something went wrong. Please try again.");
    } finally {
      setOtpVerifyLoading(false);
    }
  };

  const handleResend = async () => {
    const code = getCode();
    if (!code) return;

    const formData = new FormData();
    formData.append("code", code);

    try {
      setOtpResendLoading(true);
      setMessageType("info");
      setMessage("Generating OTP...");

      const response = (await apiRequest({
        url: "Raising/Resend/Otp",
        method: "POST",
        data: formData,
      })) as PasswordOtpResponse;

      if (response?.error) {
        setMessageType("error");
        setMessage(response.message || "Failed to resend OTP");
        return;
      }

      localStorage.setItem("code", response.code);
      setMessageType("success");
      setMessage("OTP resent successfully. Please check your email.");
    } catch {
      setMessageType("error");
      setMessage("Failed to resend OTP.");
    } finally {
      setOtpResendLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="mh-auth-form">
        <div className="row text-white">
          <div className="col-lg-12 mb-25">
            <input
              className="mh-auth-input"
              type="text"
              placeholder="Enter OTP"
              {...register("otp")}
            />
            <p className="mh-auth-error">{errors.otp?.message}</p>
          </div>

          {message && (
            <div className="col-lg-12">
              <p className={`mh-auth-message ${messageType}`}>{message}</p>
            </div>
          )}

          <div className="col-lg-12 mb-20">
            <div className="mh-auth-helper-row">
              <span>Didn&apos;t receive the OTP?</span>
              <button
                type="button"
                className="mh-auth-text-button"
                onClick={handleResend}
                disabled={otpResendLoading}
              >
                {otpResendLoading ? "Resending..." : "Resend"}
              </button>
            </div>
          </div>

          <div className="col-lg-12">
            <button
              type="submit"
              className="tg-btn w-100"
              disabled={otpResendLoading || otpVerifyLoading}
            >
              {otpVerifyLoading ? "Verifying..." : "Verify code"}
            </button>
          </div>
        </div>
      </form>

      <style jsx>{`
        .mh-auth-message {
          margin: 0 0 16px;
          font-size: 12px;
          line-height: 1.45;
        }

        .mh-auth-message.success {
          color: #7fffb0;
        }

        .mh-auth-message.error {
          color: #ff9da8;
        }

        .mh-auth-message.info {
          color: #ffd76f;
        }

        .mh-auth-helper-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          color: rgba(255, 255, 255, 0.92);
          font-size: 12px;
        }

        .mh-auth-text-button {
          padding: 0;
          border: 0;
          background: transparent;
          color: rgba(255, 255, 255, 0.92);
          font-size: 12px;
          font-weight: 600;
          text-decoration: underline;
        }

        .mh-auth-text-button:disabled {
          opacity: 0.72;
        }
      `}</style>
    </>
  );
};

export default PasswordOtpForm;
