import { useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

type AuthMode = "login" | "signup";

interface AuthPanelProps {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
}

interface FormData {
  fullName: string;
  email: string;
  password: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
}

export function AuthPanel({
  mode,
  setMode,
}: AuthPanelProps) {
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] =
    useState<FormData>({
      fullName: "",
      email: "",
      password: "",
    });

  const [errors, setErrors] = useState<FormErrors>({});

  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>,) => {
    const { name, value } = event.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));

    // Remove error while user starts correcting it
    setErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (mode === "signup" && !formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setSuccessMessage("");

    const isValid = validateForm();
    if (!isValid) {
      return;
    }

    if (mode === "login") {
      setSuccessMessage(
        "Login successful! Backend integration will come next.",
      );
      navigate("/dashboard");
    } else {
      setSuccessMessage(
        "Account created successfully! 🎉",
      );
    }

    console.log("Form submitted:", formData);
  };

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode);

    setErrors({});
    setSuccessMessage("");
  };

  return (
    <div className="rounded-[28px] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/40 sm:p-9">
      {/* HEADER */}

      <div className="mb-7">
        <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-[#edf8f5] font-bold text-[#0d5558]">
          T
        </div>

        <h2 className="text-2xl font-bold text-[#123b3d]">
          {mode === "login"
            ? "Welcome back"
            : "Create your account"}
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          {mode === "login"
            ? "Log in to continue to your workspace."
            : "Start managing your projects with Trackly."}
        </p>
      </div>

      {/* LOGIN / SIGNUP TOGGLE */}

      <div className="mb-6 grid grid-cols-2 rounded-xl bg-[#f4f7f6] p-1">
        <button
          type="button"
          onClick={() => handleModeChange("login")}
          className={`rounded-lg py-2.5 text-sm font-semibold transition ${mode === "login"
            ? "bg-white text-[#123b3d] shadow-sm"
            : "text-slate-400"
            }`}
        >
          Log in
        </button>

        <button
          type="button"
          onClick={() => handleModeChange("signup")}
          className={`rounded-lg py-2.5 text-sm font-semibold transition ${mode === "signup"
            ? "bg-white text-[#123b3d] shadow-sm"
            : "text-slate-400"
            }`}
        >
          Sign up
        </button>
      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
      >
        {mode === "signup" && (
          <Input
            label="Full name"
            placeholder="Enter your full name"
            icon={<User size={17} />}
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            error={errors.fullName}
          />
        )}

        <Input
          label="Email address"
          placeholder="you@example.com"
          icon={<Mail size={17} />}
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        {/* PASSWORD */}

        <div>
          <label className="mb-2 block text-sm font-semibold text-[#123b3d]">
            Password
          </label>

          <div className="relative">
            <LockKeyhole
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={
                mode === "signup"
                  ? "Create a strong password"
                  : "Enter your password"
              }
              className={`h-12 w-full rounded-xl border bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${errors.password
                ? "border-red-400 focus:ring-red-100"
                : "border-slate-200 focus:border-[#0d7779] focus:ring-teal-50"
                }`}
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(
                  (previousValue) => !previousValue,
                )
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0d7779]"
            >
              {showPassword ? (
                <EyeOff size={17} />
              ) : (
                <Eye size={17} />
              )}
            </button>
          </div>

          {errors.password && (
            <p className="mt-2 text-xs text-red-500">
              {errors.password}
            </p>
          )}
        </div>

        {/* LOGIN OPTIONS */}

        {mode === "login" && (
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-slate-500">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 accent-[#0d7779]"
              />

              Remember me
            </label>

            <button
              type="button"
              className="font-semibold text-[#0d7779]"
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* PASSWORD REQUIREMENTS */}

        {mode === "signup" && (
          <div className="space-y-2 text-xs text-slate-500">
            <p className="font-medium text-[#123b3d]">
              Your password should contain:
            </p>

            <div className="flex gap-4">
              <span
                className={
                  formData.password.length >= 8
                    ? "text-emerald-600"
                    : ""
                }
              >
                ✓ 8+ characters
              </span>

              <span
                className={
                  /\d/.test(formData.password)
                    ? "text-emerald-600"
                    : ""
                }
              >
                ✓ Number
              </span>
            </div>
          </div>
        )}

        {/* SUCCESS MESSAGE */}

        {successMessage && (
          <div className="rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            {successMessage}
          </div>
        )}

        {/* SUBMIT BUTTON */}

        <button
          type="submit"
          className="group flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#0d5558] font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:bg-[#09484b]"
        >
          {mode === "login"
            ? "Log in"
            : "Create account"}

          <ArrowRight
            size={17}
            className="transition group-hover:translate-x-1"
          />
        </button>
      </form>

      {/* SOCIAL LOGIN */}

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-100" />

        <span className="text-xs text-slate-400">
          or continue with
        </span>

        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          Google
        </button>

        <button
          type="button"
          className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          GitHub
        </button>
      </div>

      {/* SWITCH MODE */}

      <p className="mt-6 text-center text-sm text-slate-500">
        {mode === "login"
          ? "New to Trackly?"
          : "Already have an account?"}{" "}

        <button
          type="button"
          onClick={() =>
            handleModeChange(
              mode === "login"
                ? "signup"
                : "login",
            )
          }
          className="font-bold text-[#0d7779] hover:underline"
        >
          {mode === "login"
            ? "Sign up free"
            : "Log in"}
        </button>
      </p>
    </div>
  );
}

interface InputProps {
  label: string;
  placeholder: string;
  icon: ReactNode;
  name: keyof FormData;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  error?: string;
  type?: string;
}

function Input({
  label,
  placeholder,
  icon,
  name,
  value,
  onChange,
  error,
  type = "text",
}: InputProps) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-[#123b3d]">
        {label}
      </label>

      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
          {icon}
        </span>

        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${error
            ? "border-red-400 focus:ring-red-100"
            : "border-slate-200 focus:border-[#0d7779] focus:ring-teal-50"
            }`}
        />
      </div>

      {error && (
        <p className="mt-2 text-xs text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}