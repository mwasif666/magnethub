"use client";

import { apiRequest } from "@/api/axiosInstance";
import {
  getOnboardingRole,
  onboardingRoleConfigs,
  OnboardingQuestion,
  OnboardingRoleId,
  PRE_DASHBOARD_MESSAGE,
} from "@/data/OnboardingQuestions";
import pricing_data from "@/data/PricingData";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Link from "next/link";
import SimpleBar from "simplebar-react";
import { useSearchParams } from "next/navigation";
import { submitStripePayment } from "@/lib/submitStripePayment";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import type { StepIconProps } from "@mui/material/StepIcon";
import type { Swiper as SwiperType } from "swiper";
import styles from "./OnboardingFlow.module.css";

type StepId = "role" | "signup" | "otp" | "plan" | "checkout" | "questions";
type MessageTone = "info" | "success" | "error";

interface PricingItem {
  id: number;
  slug?: string;
  title: string;
  desc: string;
  price: number;
  list: string[];
}

interface OnboardingFlowProps {
  defaultPlanSlug?: string;
}

interface SignupState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface PaymentState {
  name: string;
  email: string;
  phone: string;
  message: string;
  cardName: string;
  cardNumber: string;
  cvc: string;
  expMonth: string;
  expYear: string;
}

interface InlineMessage {
  tone: MessageTone;
  text: string;
}

interface QuestionAnswerState {
  selectedOptions: string[];
  customValue: string;
}

const STEP_ORDER: StepId[] = [
  "role",
  "signup",
  "otp",
  "plan",
  "checkout",
  "questions",
];

const STEP_CONTENT: Record<
  StepId,
  { eyebrow: string; title: string; description: string }
> = {
  role: {
    eyebrow: "Step 1 of 6",
    title: "Select Role",
    description:
      "Choose the role that best describes how you will use Magnate Hub. This helps us customize your experience from the start.",
  },
  signup: {
    eyebrow: "Step 2 of 6",
    title: "Create Your Account",
    description:
      "Create your Magnate Hub account by entering your details. We'll email you a verification code before your account is created.",
  },
  otp: {
    eyebrow: "Step 3 of 6",
    title: "Verify Your Email",
    description:
      "Enter the verification code sent to your email. Once it's confirmed, we'll create your signup lead and unlock plan selection.",
  },
  plan: {
    eyebrow: "Step 4 of 6",
    title: "Select a Plan",
    description:
      "Choose the plan that best fits your needs. You can review features and select the option that works best for you.",
  },
  checkout: {
    eyebrow: "Step 5 of 6",
    title: "Checkout",
    description:
      "Review your selected plan and complete the payment if required. Once finished, your account will be ready for setup.",
  },
  questions: {
    eyebrow: "Step 6 of 6",
    title: "Personalize Your Dashboard",
    description:
      "Answer a few quick questions so we can tailor your dashboard and features to match your goals.",
  },
};

const DASHBOARD_URL = "https://dash.magnatehub.au/dashboard/professionals";
const STRIPE_TEST_PUBLISHABLE_KEY =
  "pk_test_51MNU17FLKdDrx0HlvOHo2FL7A2WgPTHhoF39uLjJ85HE9MzIcdfVg7538L663FmEPKf2zHRE344l4cUhekQS8Il700Ai0b51y2";
const OTP_LENGTH = 6;

const initialSignupState: SignupState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const initialPaymentState: PaymentState = {
  name: "",
  email: "",
  phone: "",
  message: "",
  cardName: "",
  cardNumber: "",
  cvc: "",
  expMonth: "",
  expYear: "",
};

const isValidRoleId = (value?: string | null): value is OnboardingRoleId =>
  onboardingRoleConfigs.some((role) => role.id === value);

const getDefaultPlanForRole = (roleId?: OnboardingRoleId | null) =>
  getOnboardingRole(roleId)?.recommendedPlanSlug ?? "free_plan";

const isBuyerRole = (roleId?: OnboardingRoleId | null) => roleId === "buyer";

const getPlanBySlug = (slug?: string | null): PricingItem | undefined =>
  pricing_data.find((item) => item.slug === slug);

const getApiErrorMessage = (error: any, fallback: string) =>
  error?.response?.data?.message ||
  error?.data?.message ||
  error?.message ||
  fallback;

const formatCardNumber = (value: string) =>
  value
    .replace(/\D/g, "")
    .slice(0, 16)
    .replace(/(.{4})/g, "$1 ")
    .trim();

const sanitizeDigits = (value: string, maxLength: number) =>
  value.replace(/\D/g, "").slice(0, maxLength);

const OnboardingStepIcon = ({ active, completed, icon }: StepIconProps) => {
  const isHighlighted = Boolean(active || completed);

  return (
    <Box
      sx={{
        width: 34,
        height: 34,
        borderRadius: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: isHighlighted
          ? "linear-gradient(90deg, #5a00ff 0%, #7d12ff 100%)"
          : "rgba(255, 255, 255, 0.24)",
        color: "#fff",
        fontSize: "14px",
        fontWeight: 700,
        lineHeight: 1,
        boxShadow: isHighlighted
          ? "0 10px 24px rgba(95, 20, 255, 0.24)"
          : "none",
      }}
    >
      {icon}
    </Box>
  );
};

const OnboardingFlow = ({ defaultPlanSlug }: OnboardingFlowProps) => {
  const searchParams = useSearchParams();
  const requestedPlan = searchParams.get("plan");
  const requestedRole = searchParams.get("role");

  const initialRoleId = isValidRoleId(requestedRole) ? requestedRole : null;
  const initialPlanSlug =
    getPlanBySlug(requestedPlan)?.slug ??
    getPlanBySlug(defaultPlanSlug)?.slug ??
    getDefaultPlanForRole(initialRoleId);

  const [currentStep, setCurrentStep] = useState<StepId>("role");
  const [selectedRoleId, setSelectedRoleId] =
    useState<OnboardingRoleId | null>(initialRoleId);
  const [selectedPlanSlug, setSelectedPlanSlug] =
    useState<string>(initialPlanSlug);
  const [planManuallySelected, setPlanManuallySelected] = useState(
    Boolean(requestedPlan || defaultPlanSlug)
  );
  const [signupState, setSignupState] = useState<SignupState>(initialSignupState);
  const [paymentState, setPaymentState] =
    useState<PaymentState>(initialPaymentState);
  const [otpCode, setOtpCode] = useState("");
  const [resendCountdown, setResendCountdown] = useState(30);
  const [expandedPlanDescriptions, setExpandedPlanDescriptions] = useState<
    Record<string, boolean>
  >({});
  const [questionAnswers, setQuestionAnswers] = useState<
    Record<string, QuestionAnswerState>
  >({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [actionLoading, setActionLoading] = useState<StepId | null>(null);
  const [otpMessage, setOtpMessage] = useState<InlineMessage | null>(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState(DASHBOARD_URL);
  const otpInputRef = useRef<HTMLInputElement | null>(null);
  const planSwiperRef = useRef<SwiperType | null>(null);

  const selectedRole = getOnboardingRole(selectedRoleId);
  const isBuyer = isBuyerRole(selectedRoleId);
  const selectedPlan = getPlanBySlug(selectedPlanSlug) ?? pricing_data[0];
  const expiryDisplayValue = paymentState.expMonth
    ? `${paymentState.expMonth}${
        paymentState.expYear ? ` / ${paymentState.expYear.slice(-2)}` : ""
      }`
    : "";
  const unansweredQuestions = selectedRole
    ? selectedRole.questions.filter((question) => {
        const answerState = questionAnswers[question.id];

        if (!answerState || answerState.selectedOptions.length === 0) {
          return true;
        }

        if (
          question.customOptionLabel &&
          answerState.selectedOptions.includes(question.customOptionLabel)
        ) {
          return !answerState.customValue.trim();
        }

        return false;
      })
    : [];
  const stripePublishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || STRIPE_TEST_PUBLISHABLE_KEY;

  useEffect(() => {
    if (!selectedRoleId || planManuallySelected) {
      return;
    }

    setSelectedPlanSlug(getDefaultPlanForRole(selectedRoleId));
  }, [selectedRoleId, planManuallySelected]);

  useEffect(() => {
    const fullName = `${signupState.firstName} ${signupState.lastName}`.trim();

    setPaymentState((current) => ({
      ...current,
      name: current.name || fullName,
      email: current.email || signupState.email,
      cardName: current.cardName || fullName,
    }));
  }, [signupState.email, signupState.firstName, signupState.lastName]);

  useEffect(() => {
    if (typeof window === "undefined" || !stripePublishableKey) {
      return;
    }

    const interval = window.setInterval(() => {
      if (window.Stripe) {
        window.Stripe.setPublishableKey(stripePublishableKey);
        window.clearInterval(interval);
      }
    }, 300);

    return () => window.clearInterval(interval);
  }, [stripePublishableKey]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setFieldErrors({});
  }, [currentStep]);

  useEffect(() => {
    if (currentStep !== "otp") {
      return;
    }

    setResendCountdown(30);

    const interval = window.setInterval(() => {
      setResendCountdown((current) => {
        if (current <= 1) {
          window.clearInterval(interval);
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [currentStep]);

  const setStep = (step: StepId) => {
    setCurrentStep(step);
  };

  const clearFieldError = (field: string) => {
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const getQuestionAnswerState = (questionId: string): QuestionAnswerState =>
    questionAnswers[questionId] ?? { selectedOptions: [], customValue: "" };

  const formatQuestionAnswer = (
    question: OnboardingQuestion,
    answerState: QuestionAnswerState
  ) => {
    const normalizedOptions = answerState.selectedOptions.map((option) =>
      option === question.customOptionLabel ? answerState.customValue.trim() : option
    );

    return question.allowMultiple ? normalizedOptions : normalizedOptions[0] ?? "";
  };

  const updateSignupField = (field: keyof SignupState, value: string) => {
    setSignupState((current) => ({ ...current, [field]: value }));
    clearFieldError(field);
  };

  const updatePaymentField = (field: keyof PaymentState, value: string) => {
    setPaymentState((current) => ({ ...current, [field]: value }));
    clearFieldError(field);
  };

  const updateExpiryValue = (value: string) => {
    const digits = sanitizeDigits(value, 4);
    const month = digits.slice(0, 2);
    const yearSuffix = digits.slice(2, 4);

    setPaymentState((current) => ({
      ...current,
      expMonth: month,
      expYear: yearSuffix ? `20${yearSuffix}` : "",
    }));
    clearFieldError("expMonth");
    clearFieldError("expYear");
  };

  const validateSignup = () => {
    const errors: Record<string, string> = {};

    if (!signupState.firstName.trim()) {
      errors.firstName = "First name is required.";
    }
    if (!signupState.lastName.trim()) {
      errors.lastName = "Last name is required.";
    }
    if (!signupState.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupState.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!signupState.password) {
      errors.password = "Password is required.";
    } else if (signupState.password.length < 6) {
      errors.password = "Password must be at least 6 characters.";
    }
    if (!signupState.confirmPassword) {
      errors.confirmPassword = "Please confirm your password.";
    } else if (signupState.confirmPassword !== signupState.password) {
      errors.confirmPassword = "Passwords must match.";
    }

    return errors;
  };

  const validatePayment = () => {
    const errors: Record<string, string> = {};

    if (!paymentState.name.trim()) {
      errors.name = "Full name is required.";
    }
    if (!paymentState.email.trim()) {
      errors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(paymentState.email.trim())) {
      errors.email = "Enter a valid email address.";
    }
    if (!paymentState.phone.trim()) {
      errors.phone = "Phone number is required.";
    }

    if (selectedPlan.price === 0) {
      return errors;
    }

    const cleanCardNumber = paymentState.cardNumber.replace(/\s/g, "");

    if (!paymentState.cardName.trim()) {
      errors.cardName = "Name on card is required.";
    }
    if (!cleanCardNumber) {
      errors.cardNumber = "Card number is required.";
    } else if (!/^\d{16}$/.test(cleanCardNumber)) {
      errors.cardNumber = "Card number must be 16 digits.";
    }
    if (!/^\d{3,4}$/.test(paymentState.cvc)) {
      errors.cvc = "Enter a valid CVC.";
    }
    if (!/^(0[1-9]|1[0-2])$/.test(paymentState.expMonth)) {
      errors.expMonth = "Enter a valid month.";
    }
    if (!/^20\d{2}$/.test(paymentState.expYear)) {
      errors.expYear = "Enter a valid year.";
    }

    return errors;
  };

  const handleContinueFromRole = () => {
    if (!selectedRoleId) {
      toast.error("Please select a role to continue.");
      return;
    }

    setStep("signup");
  };

  const handleSignupSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedRoleId) {
      toast.error("Please select a role to continue.");
      setStep("role");
      return;
    }

    const errors = validateSignup();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setActionLoading("signup");

      const response = await apiRequest({
        url: "signup/send-code",
        method: "POST",
        data: {
          email: signupState.email.trim(),
        },
      });

      if (!response) {
        toast.error("No response received from the server.");
        return;
      }

      if ((response as any).error) {
        toast.error((response as any).message || "Unable to send verification code.");
        return;
      }

      setOtpCode("");
      setOtpMessage({
        tone: "info",
        text: `We've sent a verification code to ${signupState.email.trim()}. Enter it below to continue.`,
      });
      toast.success("Verification code sent successfully.");
      setStep("otp");
    } catch (error: any) {
      toast.error(
        getApiErrorMessage(error, "Something went wrong. Please try again.")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!otpCode.trim()) {
      setFieldErrors({ otp: "OTP is required." });
      return;
    }

    if (otpCode.trim().length < OTP_LENGTH) {
      setFieldErrors({ otp: "Enter the full 6-digit code." });
      return;
    }

    try {
      setActionLoading("otp");
      setOtpMessage(null);

      const verifyResponse = await apiRequest({
        url: "signup/verify-code",
        method: "POST",
        data: {
          email: signupState.email.trim(),
          email_verification_code: otpCode.trim(),
        },
      });

      if ((verifyResponse as any).error) {
        setOtpMessage({
          tone: "error",
          text: verifyResponse.message || "Invalid verification code. Please try again.",
        });
        return;
      }
      const nextVerificationToken = (verifyResponse as any).data?.verification_token;

      if (!nextVerificationToken) {
        setOtpMessage({
          tone: "error",
          text: "Verification succeeded, but no verification token was returned.",
        });
        return;
      }

      const createLeadResponse = await apiRequest({
        url: "signup/lead",
        method: "POST",
        data: {
          role: selectedRoleId,
          first_name: signupState.firstName.trim(),
          last_name: signupState.lastName.trim(),
          email: signupState.email.trim(),
          password: signupState.password,
          password_confirmation: signupState.confirmPassword,
          verification_token: nextVerificationToken,
        },
      });

      if ((createLeadResponse as any).error) {
        setOtpMessage({
          tone: "error",
          text: createLeadResponse.message || "Your email was verified, but we could not create the signup lead.",
        });
        return;
      }

      const leadId =
        (createLeadResponse as any).lead?.id ||
        (createLeadResponse as any).data?.lead?.id;
      const leadCode =
        (createLeadResponse as any).lead?.code ||
        (createLeadResponse as any).data?.lead?.code ||
        "";

      if (!leadId || !leadCode) {
        setOtpMessage({
          tone: "error",
          text: "Lead created, but the lead ID or code was missing from the response.",
        });
        return;
      }

      sessionStorage.setItem("mh-signup-verification-token", nextVerificationToken);
      sessionStorage.setItem("mh-signup-lead-id", String(leadId));
      sessionStorage.setItem("mh-signup-lead-code", String(leadCode));

      if (isBuyerRole(selectedRoleId)) {
        const completeSignupResponse = await apiRequest({
          url: "signup/complete",
          method: "POST",
          data: {
            lead_id: leadId,
            lead_code: leadCode,
          },
        });

        if ((completeSignupResponse as any).error) {
          setOtpMessage({
            tone: "error",
            text:
              completeSignupResponse.message ||
              "Your account was verified, but buyer signup could not be completed.",
          });
          return;
        }

        setRedirectUrl(
          (completeSignupResponse as any).redirect
            ? `https://dash.magnatehub.au${
                (completeSignupResponse as any).redirect
              }`
            : DASHBOARD_URL
        );
        setPaymentCompleted(true);
        setOtpMessage({
          tone: "success",
          text: "Verification successful. Buyer signup is complete, so you can continue straight to the questions.",
        });
        toast.success("Buyer signup completed successfully.");
        setStep("questions");
        return;
      }

      setOtpMessage({
        tone: "success",
        text: "Verification successful. Your account details are saved and plan selection is ready.",
      });
      toast.success("Verification complete. Choose your plan.");
      setStep("plan");
    } catch (error: any) {
      setOtpMessage({
        tone: "error",
        text: getApiErrorMessage(
          error,
          "Unable to verify OTP. Please try again."
        ),
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleResendOtp = async () => {
    if (!signupState.email.trim()) {
      setOtpMessage({
        tone: "error",
        text: "Enter your email address first so we can resend the verification code.",
      });
      return;
    }

    try {
      setActionLoading("otp");
      setOtpMessage({
        tone: "info",
        text: "Sending a fresh verification code to your email address.",
      });

      const response = await apiRequest({
        url: "signup/send-code",
        method: "POST",
        data: {
          email: signupState.email.trim(),
        },
      });

      if ((response as any).error) {
        setOtpMessage({
          tone: "error",
          text: response.message || "Failed to resend verification code.",
        });
        return;
      }

      setResendCountdown(30);
      setOtpMessage({
        tone: "success",
        text: "Verification code resent successfully. Check your inbox and continue.",
      });
      toast.success("Verification code resent successfully.");
    } catch (error: any) {
      setOtpMessage({
        tone: "error",
        text: getApiErrorMessage(error, "Failed to resend verification code."),
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handlePlanSelect = (slug: string) => {
    setSelectedPlanSlug(slug);
    setPlanManuallySelected(true);
  };

  const handlePlanCardKeyDown = (
    event: KeyboardEvent<HTMLDivElement>,
    slug: string
  ) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handlePlanSelect(slug);
  };

  const togglePlanDescription = (planKey: string) => {
    setExpandedPlanDescriptions((current) => ({
      ...current,
      [planKey]: !current[planKey],
    }));
  };

  const handlePlanContinue = () => {
    if (!selectedPlan) {
      toast.error("Please choose a plan to continue.");
      return;
    }

    setStep("checkout");
  };

  const handleCheckoutSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const errors = validatePayment();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      setActionLoading("checkout");

      if (selectedPlan.price === 0) {
        setPaymentCompleted(true);
        setRedirectUrl(DASHBOARD_URL);
        toast.success(`${selectedPlan.title} selected.`);
        setStep("questions");
        return;
      }

      if (!window.Stripe) {
        toast.error("Stripe is still loading. Please try again in a moment.");
        return;
      }

      const stripeResponse = await new Promise<any>((resolve, reject) => {
        window.Stripe?.createToken(
          {
            number: paymentState.cardNumber.replace(/\s/g, ""),
            cvc: paymentState.cvc,
            exp_month: paymentState.expMonth,
            exp_year: paymentState.expYear,
            name: paymentState.cardName.trim(),
          },
          (_status: number, response: any) => {
            if (response?.error) {
              reject(response.error.message);
              return;
            }

            resolve(response);
          }
        );
      });

      const response = await submitStripePayment({
        stripeToken: stripeResponse.id,
        planId: selectedPlan.id,
        email: paymentState.email,
        name: paymentState.name,
        phone: paymentState.phone,
        message: paymentState.message,
      });

      setRedirectUrl(
        response?.redirect
          ? `https://dash.magnatehub.au${response.redirect}`
          : DASHBOARD_URL
      );
      setPaymentCompleted(true);
      toast.success("Payment completed successfully.");
      setStep("questions");
    } catch (error: any) {
      toast.error(
        getApiErrorMessage(error, "Payment could not be completed.")
      );
    } finally {
      setActionLoading(null);
    }
  };

  const handleQuestionSelect = (question: OnboardingQuestion, answer: string) => {
    setQuestionAnswers((current) => {
      const existing = current[question.id] ?? {
        selectedOptions: [],
        customValue: "",
      };

      const selectedOptions = question.allowMultiple
        ? existing.selectedOptions.includes(answer)
          ? existing.selectedOptions.filter((option) => option !== answer)
          : [...existing.selectedOptions, answer]
        : [answer];

      return {
        ...current,
        [question.id]: {
          selectedOptions,
          customValue:
            question.customOptionLabel &&
            !selectedOptions.includes(question.customOptionLabel)
              ? ""
              : existing.customValue,
        },
      };
    });

    clearFieldError(question.id);
  };

  const handleQuestionCustomValueChange = (questionId: string, value: string) => {
    setQuestionAnswers((current) => {
      const existing = current[questionId] ?? {
        selectedOptions: [],
        customValue: "",
      };

      return {
        ...current,
        [questionId]: {
          ...existing,
          customValue: value,
        },
      };
    });

    clearFieldError(questionId);
  };

  const handleFinishOnboarding = async () => {
    if (!selectedRole) {
      toast.error("Please select a role before continuing.");
      setStep("role");
      return;
    }

    if (unansweredQuestions.length > 0) {
      setFieldErrors((current) => ({
        ...current,
        ...Object.fromEntries(
          unansweredQuestions.map((question) => [
            question.id,
            question.customOptionLabel &&
            getQuestionAnswerState(question.id).selectedOptions.includes(
              question.customOptionLabel
            )
              ? "Please enter the custom value to continue."
              : "Please answer this question before continuing.",
          ])
        ),
      }));
      toast.error("Please answer all questions before continuing.");
      return;
    }

    const payload = {
      role_id: selectedRole.id,
      role: selectedRole.label,
      plan_slug: selectedPlan.slug,
      plan_title: selectedPlan.title,
      answers: selectedRole.questions.map((question) => ({
        id: question.id,
        question: question.prompt,
        answer: formatQuestionAnswer(question, getQuestionAnswerState(question.id)),
      })),
    };

    try {
      setActionLoading("questions");

      sessionStorage.setItem(
        "mh-onboarding-answers",
        JSON.stringify(payload.answers)
      );
      sessionStorage.setItem("mh-onboarding-plan", selectedPlan.slug || "");
      sessionStorage.setItem("mh-onboarding-role", selectedRole.id);

      const questionEndpoint =
        process.env.NEXT_PUBLIC_ONBOARDING_QUESTION_ENDPOINT;

      if (questionEndpoint) {
        await apiRequest({
          url: questionEndpoint,
          method: "POST",
          data: payload,
        });
      }

      toast.success("Onboarding complete. Redirecting to your dashboard.");

      window.setTimeout(() => {
        window.location.href = redirectUrl || DASHBOARD_URL;
      }, 700);
    } catch (error: any) {
      toast.warn(
        getApiErrorMessage(
          error,
          "Responses were kept locally. Redirecting to dashboard."
        )
      );
      window.setTimeout(() => {
        window.location.href = redirectUrl || DASHBOARD_URL;
      }, 700);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBack = () => {
    if (currentStep === "signup") {
      setStep("role");
      return;
    }

    if (currentStep === "otp") {
      setStep("signup");
      return;
    }

    if (currentStep === "plan") {
      setStep("otp");
      return;
    }

    if (currentStep === "checkout") {
      setStep("plan");
      return;
    }

    if (currentStep === "questions" && isBuyer) {
      setStep("otp");
    }
  };

  const showBackButton =
    currentStep !== "role" && !(currentStep === "questions" && paymentCompleted);
  const showStepper = currentStep !== "otp";
  const displayStepIndex =
    isBuyer
      ? currentStep === "role"
        ? 0
        : currentStep === "signup" || currentStep === "otp"
        ? 1
        : 2
      : currentStep === "role"
      ? 0
      : currentStep === "signup" || currentStep === "otp"
      ? 1
      : currentStep === "plan"
      ? 2
      : currentStep === "checkout"
      ? 3
      : 4;
  const displaySteps = isBuyer
    ? [
        {
          key: "role",
          number: 1,
          label: "ROLE",
          isActive: currentStep === "role",
          isComplete: false,
        },
        {
          key: "account",
          number: 2,
          label: "CREATE ACCOUNT",
          isActive: currentStep === "signup" || currentStep === "otp",
          isComplete: currentStep === "questions",
        },
        {
          key: "questions",
          number: 3,
          label: "QUESTIONS",
          isActive: currentStep === "questions",
          isComplete: false,
        },
      ]
    : [
        {
          key: "role",
          number: 1,
          label: "ROLE",
          isActive: currentStep === "role",
          isComplete: false,
        },
        {
          key: "account",
          number: 2,
          label: "CREATE ACCOUNT",
          isActive: currentStep === "signup" || currentStep === "otp",
          isComplete:
            currentStep === "plan" ||
            currentStep === "checkout" ||
            currentStep === "questions",
        },
        {
          key: "plan",
          number: 3,
          label: "PLAN",
          isActive: currentStep === "plan",
          isComplete: currentStep === "checkout" || currentStep === "questions",
        },
        {
          key: "checkout",
          number: 4,
          label: "CHECKOUT",
          isActive: currentStep === "checkout",
          isComplete: currentStep === "questions",
        },
        {
          key: "questions",
          number: 5,
          label: "QUESTIONS",
          isActive: currentStep === "questions",
          isComplete: false,
        },
      ];

  const renderRoleStep = () => (
    <>
      <div className={styles.roleChoiceGrid}>
        {onboardingRoleConfigs.map((role) => {
          const isActive = selectedRoleId === role.id;

          return (
            <button
              key={role.id}
              type="button"
              className={`${styles.roleChoiceButton} ${
                isActive ? styles.roleChoiceButtonActive : ""
              }`}
              onClick={() => setSelectedRoleId(role.id)}
            >
              {role.label}
            </button>
          );
        })}
      </div>
      <div className={styles.roleFooterActions}>
        <button
          type="button"
          className={`${styles.primaryButton} ${styles.rolePrimaryButton}`}
          onClick={handleContinueFromRole}
        >
          Next
        </button>
      </div>
       <div className={styles.roleBackRow}>
        <Link href="/login" className={styles.secondaryButton}>
          Back to login
        </Link>
      </div>
    </>
  );

  const renderSignupStep = () => (
    <form
      onSubmit={handleSignupSubmit}
      className={styles.signupForm}
      autoComplete="off"
    >
      <input
        type="text"
        name="fake_username"
        autoComplete="username"
        tabIndex={-1}
        className={styles.autofillTrap}
      />
      <input
        type="password"
        name="fake_password"
        autoComplete="current-password"
        tabIndex={-1}
        className={styles.autofillTrap}
      />
      <div className={`${styles.formGrid} ${styles.signupFormGrid}`}>
        <div className={styles.field}>
          <label className={`${styles.label} ${styles.signupLabel}`}>
            First name
          </label>
          <input
            className={`${styles.input} ${styles.signupInputGhost}`}
            name="register_first_name"
            autoComplete="off"
            value={signupState.firstName}
            onChange={(event) =>
              updateSignupField("firstName", event.target.value)
            }
            placeholder="John"
          />
          <p className={styles.error}>{fieldErrors.firstName}</p>
        </div>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.signupLabel}`}>
            Last name
          </label>
          <input
            className={`${styles.input} ${styles.signupInputGhost}`}
            name="register_last_name"
            autoComplete="off"
            value={signupState.lastName}
            onChange={(event) =>
              updateSignupField("lastName", event.target.value)
            }
            placeholder="Doe"
          />
          <p className={styles.error}>{fieldErrors.lastName}</p>
        </div>

        <div className={`${styles.field} ${styles.fieldFull}`}>
          <label className={`${styles.label} ${styles.signupLabel}`}>
            Email address
          </label>
          <input
            className={`${styles.input} ${styles.signupInputSolid}`}
            type="email"
            name="register_email"
            autoComplete="off"
            value={signupState.email}
            onChange={(event) => updateSignupField("email", event.target.value)}
            placeholder="john@example.com"
          />
          <p className={styles.error}>{fieldErrors.email}</p>
        </div>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.signupLabel}`}>
            Password
          </label>
          <input
            className={`${styles.input} ${styles.signupInputSolid}`}
            type="password"
            name="register_password"
            autoComplete="new-password"
            value={signupState.password}
            onChange={(event) =>
              updateSignupField("password", event.target.value)
            }
            placeholder="Minimum 6 characters"
          />
          <p className={styles.error}>{fieldErrors.password}</p>
        </div>

        <div className={styles.field}>
          <label className={`${styles.label} ${styles.signupLabel}`}>
            Confirm password
          </label>
          <input
            className={`${styles.input} ${styles.signupInputSolid}`}
            type="password"
            name="register_confirm_password"
            autoComplete="new-password"
            value={signupState.confirmPassword}
            onChange={(event) =>
              updateSignupField("confirmPassword", event.target.value)
            }
            placeholder="Re-type password"
          />
          <p className={styles.error}>{fieldErrors.confirmPassword}</p>
        </div>
      </div>

      <div className={styles.inlineFooter}>
        <span>Already have an account?</span>
        <Link href="/login" className={styles.inlineLink}>
          Log in
        </Link>
      </div>

      <div className={styles.actionRow}>
        <button
          type="submit"
          className={`${styles.primaryButton} ${styles.signupPrimaryButton}`}
          disabled={actionLoading === "signup"}
        >
          {actionLoading === "signup" ? "Creating account..." : "Create account"}
        </button>
      </div>
    </form>
  );

  const renderOtpStep = () => (
    <form onSubmit={handleVerifyOtp}>
      <div className={styles.otpWrap}>
        <input
          ref={otpInputRef}
          className={styles.otpHiddenInput}
          value={otpCode}
          onChange={(event) => {
            setOtpCode(sanitizeDigits(event.target.value, OTP_LENGTH));
            clearFieldError("otp");
          }}
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
        <div className={`${styles.messageBox} ${styles[`message${otpMessage.tone}`]}`}>
          {otpMessage.text}
        </div>
      )}

      <div className={styles.inlineFooter}>
        <span>Didn't receive the code?</span>
        <button
          type="button"
          className={styles.linkButton}
          onClick={handleResendOtp}
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

  const renderPlanStep = () => (
    <>
      <div className={styles.planToolbar}>
        <p className={styles.planToolbarText}>Swipe to compare plans and pick the best fit.</p>
        {pricing_data.length > 1 && (
          <div className={styles.planNav}>
            <button
              type="button"
              className={styles.planNavButton}
              onClick={() => planSwiperRef.current?.slidePrev()}
              aria-label="Show previous plans"
            >
              <i className="fa-solid fa-arrow-left-long" />
            </button>
            <button
              type="button"
              className={styles.planNavButton}
              onClick={() => planSwiperRef.current?.slideNext()}
              aria-label="Show next plans"
            >
              <i className="fa-solid fa-arrow-right-long" />
            </button>
          </div>
        )}
      </div>

      <div className={styles.planGrid}>
        <Swiper
          className={styles.planSwiper}
          spaceBetween={16}
          slidesPerView={1.18}
          watchOverflow={true}
          breakpoints={{
            576: { slidesPerView: 1.35 },
            768: { slidesPerView: 1.9 },
            1200: { slidesPerView: 2.35 },
          }}
          onSwiper={(swiper) => {
            planSwiperRef.current = swiper;
          }}
        >
          {pricing_data.map((plan) => {
            const planKey = plan.slug || String(plan.id);
            const isActive = plan.slug === selectedPlan.slug;
            const isRecommended = selectedRole?.recommendedPlanSlug === plan.slug;
            const isExpanded = Boolean(expandedPlanDescriptions[planKey]);
            const shouldShowToggle = plan.desc.trim().length > 140;

            return (
              <SwiperSlide key={plan.id} className={styles.planSlide}>
                <div
                  role="button"
                  tabIndex={0}
                  className={`${styles.planCard} ${isActive ? styles.planCardActive : ""}`}
                  onClick={() => handlePlanSelect(plan.slug || "")}
                  onKeyDown={(event) =>
                    handlePlanCardKeyDown(event, plan.slug || "")
                  }
                >
                  <div className={styles.planHeader}>
                    <div>
                      <h3 className={styles.planTitle}>{plan.title}</h3>
                      <p className={styles.planPrice}>
                        ${plan.price}
                        <span>{plan.price === 0 ? " / free" : " / once off"}</span>
                      </p>
                    </div>
                    {isRecommended && (
                      <span className={styles.recommendedTag}>Recommended</span>
                    )}
                  </div>

                  <div className={styles.planDescriptionWrap}>
                    <p
                      className={`${styles.planDescription} ${
                        !isExpanded ? styles.planDescriptionCollapsed : ""
                      }`}
                    >
                      {plan.desc.trim()}
                    </p>
                    {shouldShowToggle && (
                      <button
                        type="button"
                        className={styles.readMoreButton}
                        onClick={(event) => {
                          event.stopPropagation();
                          togglePlanDescription(planKey);
                        }}
                      >
                        {isExpanded ? "Read less" : "Read more"}
                      </button>
                    )}
                  </div>

                  <SimpleBar autoHide={true} className={styles.planListScroll}>
                    <ul className={styles.planList}>
                      {plan.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </SimpleBar>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>

      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handlePlanContinue}
        >
          Continue to checkout
        </button>
      </div>
    </>
  );

  const renderCheckoutStep = () => (
    <form onSubmit={handleCheckoutSubmit}>
      <div className={styles.checkoutGrid}>
        <div className={styles.checkoutFormPanel}>
          {selectedPlan.price > 0 && (
            <div className={styles.checkoutSection}>
              <div className={styles.checkoutSectionHeader}>
                <h3 className={styles.checkoutSectionTitle}>
                  Payment information
                </h3>
                <span className={styles.checkoutSecurityNote}>
                  Secured by Stripe
                </span>
              </div>

              <div className={styles.checkoutPaymentGrid}>
                <div className={`${styles.field} ${styles.checkoutFieldWide}`}>
                  <input
                    className={`${styles.input} ${styles.checkoutInput}`}
                    value={paymentState.cardNumber}
                    onChange={(event) =>
                      updatePaymentField(
                        "cardNumber",
                        formatCardNumber(event.target.value)
                      )
                    }
                    placeholder="Card number"
                    inputMode="numeric"
                  />
                  <p className={styles.error}>{fieldErrors.cardNumber}</p>
                </div>

                <div className={styles.field}>
                  <input
                    className={`${styles.input} ${styles.checkoutInput}`}
                    value={expiryDisplayValue}
                    onChange={(event) => updateExpiryValue(event.target.value)}
                    placeholder="MM / YY"
                    inputMode="numeric"
                  />
                  <p className={styles.error}>
                    {fieldErrors.expMonth || fieldErrors.expYear}
                  </p>
                </div>

                <div className={styles.field}>
                  <input
                    className={`${styles.input} ${styles.checkoutInput}`}
                    value={paymentState.cardName}
                    onChange={(event) =>
                      updatePaymentField("cardName", event.target.value)
                    }
                    placeholder="Name on card"
                  />
                  <p className={styles.error}>{fieldErrors.cardName}</p>
                </div>

                <div className={styles.field}>
                  <input
                    className={`${styles.input} ${styles.checkoutInput}`}
                    value={paymentState.cvc}
                    onChange={(event) =>
                      updatePaymentField(
                        "cvc",
                        sanitizeDigits(event.target.value, 4)
                      )
                    }
                    placeholder="CVV"
                    inputMode="numeric"
                  />
                  <p className={styles.error}>{fieldErrors.cvc}</p>
                </div>
              </div>
            </div>
          )}

          <div className={styles.checkoutSection}>
            <h3 className={styles.checkoutSectionTitle}>Billing information</h3>
            <div className={styles.formGrid}>
              <div className={styles.field}>
                <label className={styles.label}>Full name</label>
                <input
                  className={`${styles.input} ${styles.checkoutInput}`}
                  value={paymentState.name}
                  onChange={(event) =>
                    updatePaymentField("name", event.target.value)
                  }
                  placeholder="John Doe"
                />
                <p className={styles.error}>{fieldErrors.name}</p>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>Email address</label>
                <input
                  className={`${styles.input} ${styles.checkoutInput}`}
                  type="email"
                  value={paymentState.email}
                  onChange={(event) =>
                    updatePaymentField("email", event.target.value)
                  }
                  placeholder="john@example.com"
                />
                <p className={styles.error}>{fieldErrors.email}</p>
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label}>Phone number</label>
                <input
                  className={`${styles.input} ${styles.checkoutInput}`}
                  value={paymentState.phone}
                  onChange={(event) =>
                    updatePaymentField("phone", event.target.value)
                  }
                  placeholder="+61 400 000 000"
                />
                <p className={styles.error}>{fieldErrors.phone}</p>
              </div>

              <div className={`${styles.field} ${styles.fieldFull}`}>
                <label className={styles.label}>Message</label>
                <textarea
                  className={`${styles.textarea} ${styles.checkoutTextarea}`}
                  value={paymentState.message}
                  onChange={(event) =>
                    updatePaymentField("message", event.target.value)
                  }
                  placeholder="Any additional details you want the team to know..."
                />
              </div>
            </div>
          </div>

          <div className={styles.checkoutNotice}>
            {selectedPlan.price === 0
              ? "Free plan selected. No card details are required. Continue to the final setup questions."
              : "Payment is processed securely through Stripe. After a successful payment, you will continue to the onboarding questions."}
          </div>

          <div className={`${styles.actionRow} ${styles.checkoutActionRow}`}>
            <button
              type="submit"
              className={`${styles.primaryButton} ${styles.checkoutPrimaryButton}`}
              disabled={actionLoading === "checkout"}
            >
              {actionLoading === "checkout"
                ? "Processing..."
                : selectedPlan.price === 0
                ? "Continue to questions"
                : `Pay $${selectedPlan.price} and continue`}
            </button>
          </div>
        </div>

        <aside className={styles.checkoutSummaryPanel}>
          <div className={styles.summaryPanel}>
            <span className={styles.summaryEyebrow}>Selected plan</span>
            <h3 className={styles.summaryTitle}>{selectedPlan.title}</h3>
            <p className={styles.summaryAmount}>${selectedPlan.price}</p>
            <p className={styles.summaryText}>{selectedPlan.desc.trim()}</p>

            <ul className={styles.summaryList}>
              {selectedPlan.list.slice(0, 5).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className={styles.secureBadge}>Secure Stripe tokenised payment</div>
          </div>
        </aside>
      </div>
    </form>
  );

  const renderQuestionsStep = () => (
    <>
      <div className={styles.messageBox}>{PRE_DASHBOARD_MESSAGE}</div>

      <div className={styles.questionList}>
        {selectedRole?.questions.map((question, index) => (
          <div key={question.id} className={styles.questionCard}>
            <div className={styles.questionHeader}>
              <span className={styles.questionNumber}>{index + 1}</span>
              <div>
                <h3 className={styles.questionTitle}>{question.prompt}</h3>
                {question.helperText && (
                  <p className={styles.questionHelper}>{question.helperText}</p>
                )}
              </div>
            </div>

            <div className={styles.optionGrid}>
              {question.options.map((option) => {
                const answerState = getQuestionAnswerState(question.id);
                const isActive = answerState.selectedOptions.includes(option);

                return (
                  <button
                    key={option}
                    type="button"
                    className={`${styles.optionButton} ${
                      isActive ? styles.optionButtonActive : ""
                    }`}
                    onClick={() => handleQuestionSelect(question, option)}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            {question.customOptionLabel &&
              getQuestionAnswerState(question.id).selectedOptions.includes(
                question.customOptionLabel
              ) && (
                <div className={styles.questionCustomField}>
                  <input
                    className={styles.input}
                    value={getQuestionAnswerState(question.id).customValue}
                    onChange={(event) =>
                      handleQuestionCustomValueChange(question.id, event.target.value)
                    }
                    placeholder={
                      question.customInputPlaceholder || "Enter your answer"
                    }
                  />
                </div>
              )}

            <p className={styles.error}>{fieldErrors[question.id]}</p>
          </div>
        ))}
      </div>

      <p className={styles.helperText}>
        {unansweredQuestions.length === 0
          ? "All questions answered. You can finish onboarding."
          : `${unansweredQuestions.length} question${
              unansweredQuestions.length > 1 ? "s are" : " is"
            } still pending.`}
      </p>

      <div className={styles.actionRow}>
        <button
          type="button"
          className={styles.primaryButton}
          onClick={handleFinishOnboarding}
          disabled={actionLoading === "questions"}
        >
          {actionLoading === "questions"
            ? "Finalising..."
            : "Finish and open dashboard"}
        </button>
      </div>
    </>
  );

  const currentStepContent = STEP_CONTENT[currentStep];
  const shellClassName = `${styles.shell} ${
    currentStep === "plan" ||
    currentStep === "questions" ||
    currentStep === "checkout"
      ? styles.shellWide
      : currentStep === "otp"
      ? styles.shellCompact
      : ""
  }`;

  return (
    <section className={styles.area}>
      <div className="container " style={{marginTop:"5rem"}}>
        <div className="row justify-content-center">
          <div className="col-xl-11 col-lg-11">
            <div className={shellClassName}>
              <aside className={styles.sidebar}>
                <span className={styles.brand}>Magnate Hub Onboarding</span>
                <h2 className={styles.sidebarTitle}>
                  Create, verify, choose your package, and launch.
                </h2>
                <p className={styles.sidebarText}>
                  The flow follows the sequence you requested: role, signup, OTP,
                  plan selection, checkout, then role-based dashboard questions.
                </p>

                {showStepper && (
                  <Box
                    sx={{
                      width: "100%",
                      mb: "28px",
                      overflowX: { xs: "auto", md: "visible" },
                      pb: { xs: "4px", md: 0 },
                      scrollbarWidth: "none",
                      "&::-webkit-scrollbar": {
                        display: "none",
                      },
                      "& .MuiStepper-root": {
                        width: { xs: "620px", md: "100%" },
                      },
                      "& .MuiStep-root": {
                        px: 0,
                      },
                      "& .MuiStepLabel-root": {
                        alignItems: "center",
                      },
                      "& .MuiStepLabel-alternativeLabel": {
                        alignItems: "center",
                      },
                      "& .MuiStepLabel-labelContainer": {
                        mt: "14px",
                      },
                      "& .MuiStepLabel-label": {
                        mt: "0 !important",
                        color: "rgba(255, 255, 255, 0.92)",
                        fontSize: "12px",
                        fontWeight: 700,
                        lineHeight: 1.35,
                        letterSpacing: "0.08em",
                        textAlign: "center",
                        textTransform: "uppercase",
                        whiteSpace: "nowrap",
                      },
                      "& .MuiStepLabel-label.Mui-active, & .MuiStepLabel-label.Mui-completed":
                        {
                          color: "#fff",
                        },
                      "& .MuiStepConnector-root": {
                        top: "17px",
                        left: "calc(-50% + 28px)",
                        right: "calc(50% + 28px)",
                      },
                      "& .MuiStepConnector-line": {
                        borderTopWidth: "2px",
                        borderColor: "rgba(255, 255, 255, 0.22)",
                      },
                      "& .MuiStepConnector-root.Mui-active .MuiStepConnector-line, & .MuiStepConnector-root.Mui-completed .MuiStepConnector-line":
                        {
                          borderColor: "#7d12ff",
                        },
                    }}
                  >
                    <Stepper activeStep={displayStepIndex} alternativeLabel>
                      {displaySteps.map((step, index) => (
                        <Step
                          key={step.key}
                          completed={displayStepIndex > index}
                        >
                          <StepLabel StepIconComponent={OnboardingStepIcon}>
                            {step.label}
                          </StepLabel>
                        </Step>
                      ))}
                    </Stepper>
                  </Box>
                )}

                <div className={styles.summaryCard}>
                  <div className={styles.summaryRow}>
                    <span>Role</span>
                    <strong>{selectedRole?.label || "Not selected"}</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Email</span>
                    <strong>{signupState.email || "Pending"}</strong>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Plan</span>
                    <strong>
                      {selectedPlan.title}{" "}
                      {selectedPlan.price === 0 ? "(Free)" : `($${selectedPlan.price})`}
                    </strong>
                  </div>
                </div>
              </aside>

              <div className={styles.content}>
                <div className={styles.contentHeader}>
                  <p className={styles.eyebrow}>{currentStepContent.eyebrow}</p>
                  <h1 className={styles.title}>{currentStepContent.title}</h1>
                  <p className={styles.description}>
                    {currentStepContent.description}
                  </p>
                </div>

                <div className={styles.contentBody}>
                  {currentStep === "role" && renderRoleStep()}
                  {currentStep === "signup" && renderSignupStep()}
                  {currentStep === "otp" && renderOtpStep()}
                  {currentStep === "plan" && renderPlanStep()}
                  {currentStep === "checkout" && renderCheckoutStep()}
                  {currentStep === "questions" && renderQuestionsStep()}
                </div>

                {showBackButton && (
                  <div className={styles.footerActions}>
                    <button
                      type="button"
                      className={styles.secondaryButton}
                      onClick={handleBack}
                      disabled={actionLoading !== null}
                    >
                      Back
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OnboardingFlow;
