"use client";

import type { OtpStepProps } from "../types";
import { OTP_LENGTH, sanitizeDigits } from "../utils";
import styles from "../../OnboardingFlow.module.css";

const OtpStep = ({
  otpCode,
  resendCountdown,
  fieldErrors,
  otpMessage,
  actionLoading,
  otpInputRef,
  onSubmit,
  onOtpChange,
  onResend,
}: OtpStepProps) => (
  <form onSubmit={onSubmit}>
    <div className={styles.otpWrap}>
      <input
        ref={otpInputRef}
        className={styles.otpHiddenInput}
        value={otpCode}
        onChange={(event) =>
          onOtpChange(sanitizeDigits(event.target.value, OTP_LENGTH))
        }
        inputMode="numeric"
        maxLength={OTP_LENGTH}
      />

      <div
        className={styles.otpBoxRow}
        onClick={() => otpInputRef.current?.focus()}
        role="presentation"
      >
        {Array.from({ length: OTP_LENGTH }).map((_, index) => (
          <div key={index} className={styles.otpBox}>
            {otpCode[index] || ""}
          </div>
        ))}
      </div>

      <p className={styles.otpTimer}>
        00:{String(resendCountdown).padStart(2, "0")}
      </p>
      <p className={styles.error}>{fieldErrors.otp}</p>
    </div>

    {otpMessage && (
      <div
        className={`${styles.messageBox} ${styles[`message${otpMessage.tone}`]}`}
      >
        {otpMessage.text}
      </div>
    )}

    <div className={styles.inlineFooter}>
      <span>Didn't receive the code?</span>
      <button
        type="button"
        className={styles.linkButton}
        onClick={onResend}
        disabled={actionLoading === "otp" || resendCountdown > 0}
      >
        {actionLoading === "otp" ? "Please wait..." : "Resend"}
      </button>
    </div>

    <div className={styles.actionRow}>
      <button
        type="submit"
        className={styles.primaryButton}
        disabled={actionLoading === "otp"}
      >
        {actionLoading === "otp" ? "Verifying..." : "Verify and continue"}
      </button>
    </div>
  </form>
);

export default OtpStep;
