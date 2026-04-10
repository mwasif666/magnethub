"use client";

import { apiRequest } from "@/api/axiosInstance";
import {
  getOnboardingRole,
  onboardingRoleConfigs,
  OnboardingQuestion,
  OnboardingRoleId,
} from "@/data/OnboardingQuestions";
import pricing_data from "@/data/PricingData";
import { useSearchParams } from "next/navigation";
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import type { Swiper as SwiperType } from "swiper";
import OnboardingSidebar from "./flow/OnboardingSidebar";
import CheckoutStep from "./flow/steps/CheckoutStep";
import OtpStep from "./flow/steps/OtpStep";
import PlanStep from "./flow/steps/PlanStep";
import QuestionsStep from "./flow/steps/QuestionsStep";
import RoleStep from "./flow/steps/RoleStep";
import SignupStep from "./flow/steps/SignupStep";
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
    title: "",
    description:"",
  },
  questions: {
    eyebrow: "Step 6 of 6",
    title: "Personalize Your Dashboard",
    description:
      "Answer a few quick questions so we can tailor your dashboard and features to match your goals.",
  },
};

const DASHBOARD_URL = "https://dash.magnatehub.au/dashboard/professionals";
const STRIPE_TEST_PUBLISHABLE_KEY = "pk_test_51MNU17FLKdDrx0HlvOHo2FL7A2WgPTHhoF39uLjJ85HE9MzIcdfVg7538L663FmEPKf2zHRE344l4cUhekQS8Il700Ai0b51y2";
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

const getStripeExpiryYear = (expYear: string) =>
  expYear.length === 2 ? `20${expYear}` : expYear;

const extractQuestionOptions = (rawQuestion: any): string[] => {
  const source =
    rawQuestion?.options ??
    rawQuestion?.answer_options ??
    rawQuestion?.choices ??
    [];

  if (!Array.isArray(source)) {
    return [];
  }

  return source
    .map((option: any) => {
      if (typeof option === "string") {
        return option;
      }

      return (
        option?.label ??
        option?.title ??
        option?.name ??
        option?.value ??
        ""
      );
    })
    .filter(Boolean);
};

const mapApiQuestion = (rawQuestion: any): OnboardingQuestion => ({
  id: String(rawQuestion?.id ?? rawQuestion?.professional_question_id ?? ""),
  professionalQuestionId: Number(
    rawQuestion?.id ?? rawQuestion?.professional_question_id ?? 0
  ),
  prompt:
    rawQuestion?.question ??
    rawQuestion?.prompt ??
    rawQuestion?.title ??
    "",
  options: extractQuestionOptions(rawQuestion),
  allowMultiple: Boolean(
    rawQuestion?.allow_multiple ?? rawQuestion?.is_multiple ?? false
  ),
  customOptionLabel:
    rawQuestion?.custom_option_label ??
    rawQuestion?.other_option_label ??
    undefined,
  customInputPlaceholder:
    rawQuestion?.custom_input_placeholder ??
    rawQuestion?.other_input_placeholder ??
    undefined,
  helperText: rawQuestion?.helper_text ?? undefined,
});

const extractApiQuestions = (payload: any): OnboardingQuestion[] => {
  const questionList =
    payload?.data?.questions ??
    payload?.questions ??
    payload?.data ??
    payload;

  if (!Array.isArray(questionList)) {
    return [];
  }

  return questionList
    .map(mapApiQuestion)
    .filter((question) => question.id && question.prompt);
};

const normalizeExistingAnswer = (
  question: OnboardingQuestion,
  rawAnswer: any
): QuestionAnswerState => {
  if (Array.isArray(rawAnswer)) {
    return {
      selectedOptions: rawAnswer.map((value) => String(value)),
      customValue: "",
    };
  }

  const answerText = String(rawAnswer ?? "").trim();

  if (!answerText) {
    return { selectedOptions: [], customValue: "" };
  }

  if (question.allowMultiple) {
    return {
      selectedOptions: answerText.split(",").map((value) => value.trim()).filter(Boolean),
      customValue: "",
    };
  }

  return {
    selectedOptions: [answerText],
    customValue: "",
  };
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
  const [apiQuestions, setApiQuestions] = useState<
    Partial<Record<OnboardingRoleId, OnboardingQuestion[]>>
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
  const activeQuestions =
    (selectedRoleId ? apiQuestions[selectedRoleId] : undefined) ??
    selectedRole?.questions ??
    [];
  const expiryDisplayValue = `${paymentState.expMonth}${
    paymentState.expMonth.length === 2 ? "/" : ""
  }${paymentState.expYear}`;
  const unansweredQuestions = activeQuestions.filter((question) => {
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
      });
  const stripePublishableKey =
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY || STRIPE_TEST_PUBLISHABLE_KEY;

  useEffect(() => {
    if (!selectedRoleId || planManuallySelected) {
      return;
    }

    setSelectedPlanSlug(getDefaultPlanForRole(selectedRoleId));
  }, [selectedRoleId, planManuallySelected]);

  useEffect(() => {
    if (!selectedRoleId || apiQuestions[selectedRoleId]) {
      return;
    }

    let isActive = true;

    const loadRoleQuestions = async () => {
      try {
        const response = await apiRequest({
          url: `professional-questions/${selectedRoleId}`,
          method: "GET",
        });

        if (!isActive) {
          return;
        }

        const questions = extractApiQuestions(response);

        if (questions.length > 0) {
          setApiQuestions((current) => ({
            ...current,
            [selectedRoleId]: questions,
          }));
        }
      } catch {
        // Keep local fallback questions when API questions are unavailable.
      }
    };

    loadRoleQuestions();

    return () => {
      isActive = false;
    };
  }, [apiQuestions, selectedRoleId]);

  useEffect(() => {
    if (currentStep !== "questions" || activeQuestions.length === 0) {
      return;
    }

    let isActive = true;

    const loadSubmittedAnswers = async () => {
      try {
        const response = await apiRequest({
          url: "professional-question-answers",
          method: "GET",
        });

        if (!isActive) {
          return;
        }

        const submittedAnswers =
          response?.data?.answers ??
          response?.answers ??
          response?.data ??
          response;

        if (!Array.isArray(submittedAnswers)) {
          return;
        }

        setQuestionAnswers((current) => {
          const nextState = { ...current };

          submittedAnswers.forEach((item: any) => {
            const question = activeQuestions.find(
              (entry) =>
                entry.professionalQuestionId ===
                Number(item?.professional_question_id ?? item?.id ?? 0)
            );

            if (!question || nextState[question.id]) {
              return;
            }

            nextState[question.id] = normalizeExistingAnswer(
              question,
              item?.answer
            );
          });

          return nextState;
        });
      } catch {
        // Leave the form blank when no previous answers exist.
      }
    };

    loadSubmittedAnswers();

    return () => {
      isActive = false;
    };
  }, [activeQuestions, currentStep]);

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

    return question.allowMultiple
      ? normalizedOptions.filter(Boolean).join(", ")
      : normalizedOptions[0] ?? "";
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
      expYear: yearSuffix,
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
    if (!/^\d{2}$/.test(paymentState.expYear)) {
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

      const leadId = (createLeadResponse as any).data?.lead?.id;
      const leadCode = (createLeadResponse as any).data?.lead?.code || "";

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

      const leadId = sessionStorage.getItem("mh-signup-lead-id");
      const leadCode = sessionStorage.getItem("mh-signup-lead-code");

      if (!leadId || !leadCode) {
        toast.error("Signup session is missing lead details. Please restart signup.");
        return;
      }

      const payload: Record<string, string | number> = {
        lead_id: Number(leadId),
        lead_code: leadCode,
        plan_id: selectedPlan.id,
      };

      if (selectedPlan.price > 0) {
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
              exp_year: getStripeExpiryYear(paymentState.expYear),
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

        payload.stripe_token = stripeResponse.id;
      }

      const response = await apiRequest({
        url: "signup/complete",
        method: "POST",
        data: payload,
      });

      if ((response as any)?.error) {
        toast.error((response as any)?.message || "Signup could not be completed.");
        return;
      }

      await apiRequest({
        url: "signup/lead/delete",
        method: "POST",
        data: {
          lead_id: Number(leadId),
          lead_code: leadCode,
        },
      }).catch(() => null);

      sessionStorage.removeItem("mh-signup-lead-id");
      sessionStorage.removeItem("mh-signup-lead-code");
      sessionStorage.removeItem("mh-signup-verification-token");

      setRedirectUrl(
        (response as any)?.redirect
          ? `https://dash.magnatehub.au${(response as any).redirect}`
          : DASHBOARD_URL
      );
      setPaymentCompleted(true);
      toast.success(
        selectedPlan.price > 0
          ? "Payment completed successfully."
          : `${selectedPlan.title} selected successfully.`
      );
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
      answers: activeQuestions.map((question) => ({
        professional_question_id: question.professionalQuestionId,
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

      if (
        payload.answers.length === 0 ||
        payload.answers.some((answer) => !answer.professional_question_id)
      ) {
        toast.error(
          "Professional questions could not be loaded correctly. Please refresh and try again."
        );
        return;
      }

      await apiRequest({
        url: "professional-question-answers",
        method: "POST",
        data: payload,
      });

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
          label: "ROLE",
        },
        {
          key: "account",
          label: "CREATE ACCOUNT",
        },
        {
          key: "questions",
          label: "QUESTIONS",
        },
      ]
    : [
        {
          key: "role",
          label: "ROLE",
        },
        {
          key: "account",
          label: "CREATE ACCOUNT",
        },
        {
          key: "plan",
          label: "PLAN",
        },
        {
          key: "checkout",
          label: "CHECKOUT",
        },
        {
          key: "questions",
          label: "QUESTIONS",
        },
      ];

  const renderStep = () => {
    if (currentStep === "role") {
      return (
        <RoleStep
          selectedRoleId={selectedRoleId}
          onSelectRole={setSelectedRoleId}
          onContinue={handleContinueFromRole}
        />
      );
    }

    if (currentStep === "signup") {
      return (
        <SignupStep
          signupState={signupState}
          fieldErrors={fieldErrors}
          actionLoading={actionLoading}
          onSubmit={handleSignupSubmit}
          onUpdateField={updateSignupField}
        />
      );
    }

    if (currentStep === "otp") {
      return (
        <OtpStep
          otpCode={otpCode}
          resendCountdown={resendCountdown}
          fieldErrors={fieldErrors}
          otpMessage={otpMessage}
          actionLoading={actionLoading}
          otpInputRef={otpInputRef}
          onSubmit={handleVerifyOtp}
          onOtpChange={(value) => {
            setOtpCode(value);
            clearFieldError("otp");
          }}
          onResend={handleResendOtp}
        />
      );
    }

    if (currentStep === "plan") {
      return (
        <PlanStep
          selectedPlan={selectedPlan}
          selectedRole={selectedRole}
          expandedPlanDescriptions={expandedPlanDescriptions}
          planSwiperRef={planSwiperRef}
          onSelectPlan={handlePlanSelect}
          onPlanCardKeyDown={handlePlanCardKeyDown}
          onToggleDescription={togglePlanDescription}
          onContinue={handlePlanContinue}
        />
      );
    }

    if (currentStep === "checkout") {
      return (
        <CheckoutStep
          selectedPlan={selectedPlan}
          paymentState={paymentState}
          expiryDisplayValue={expiryDisplayValue}
          fieldErrors={fieldErrors}
          actionLoading={actionLoading}
          onSubmit={handleCheckoutSubmit}
          onUpdateField={updatePaymentField}
          onUpdateExpiryValue={updateExpiryValue}
          formatCardNumber={formatCardNumber}
          sanitizeDigits={sanitizeDigits}
        />
      );
    }

    return (
      <QuestionsStep
        activeQuestions={activeQuestions}
        questionAnswers={questionAnswers}
        unansweredQuestions={unansweredQuestions}
        fieldErrors={fieldErrors}
        actionLoading={actionLoading}
        onSelectQuestion={handleQuestionSelect}
        onCustomValueChange={handleQuestionCustomValueChange}
        onFinish={handleFinishOnboarding}
      />
    );
  };

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
              <OnboardingSidebar
                displayStepIndex={displayStepIndex}
                displaySteps={displaySteps}
                showStepper={showStepper}
                summary={{
                  roleLabel: selectedRole?.label || "Not selected",
                  email: signupState.email || "Pending",
                  planTitle: selectedPlan.title,
                  planPrice: selectedPlan.price,
                }}
              />

              <div className={styles.content}>
                <div
                  className={`${styles.contentHeader} ${
                    currentStep === "checkout" ? styles.contentHeaderCentered : ""
                  }`}
                >
                  <p className={styles.eyebrow}>{currentStepContent.eyebrow}</p>
                  <h1 className={styles.title}>{currentStepContent.title}</h1>
                  <p className={styles.description}>
                    {currentStepContent.description}
                  </p>
                </div>

                <div className={styles.contentBody}>{renderStep()}</div>

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
