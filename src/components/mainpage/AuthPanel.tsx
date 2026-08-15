import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
//   Github,
  LockKeyhole,
  Mail,
  User,
} from "lucide-react";

type AuthMode = "login" | "signup";

interface AuthPanelProps {
  mode: AuthMode;
  setMode: (mode: AuthMode) => void;
}

export function AuthPanel({
  mode,
  setMode,
}: AuthPanelProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div className="rounded-[28px] border border-slate-100 bg-white p-7 shadow-xl shadow-slate-200/40 sm:p-9">
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

      {/* Toggle */}
      <div className="mb-6 grid grid-cols-2 rounded-xl bg-[#f4f7f6] p-1">
        <button
          onClick={() => setMode("login")}
          className={`rounded-lg py-2.5 text-sm font-semibold transition ${
            mode === "login"
              ? "bg-white text-[#123b3d] shadow-sm"
              : "text-slate-400"
          }`}
        >
          Log in
        </button>

        <button
          onClick={() => setMode("signup")}
          className={`rounded-lg py-2.5 text-sm font-semibold transition ${
            mode === "signup"
              ? "bg-white text-[#123b3d] shadow-sm"
              : "text-slate-400"
          }`}
        >
          Sign up
        </button>
      </div>

      <form className="space-y-5">
        {mode === "signup" && (
          <Input
            label="Full name"
            placeholder="Enter your full name"
            icon={<User size={17} />}
          />
        )}

        <Input
          label="Email address"
          placeholder="you@example.com"
          type="email"
          icon={<Mail size={17} />}
        />

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
              placeholder={
                mode === "signup"
                  ? "Create a strong password"
                  : "Enter your password"
              }
              className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0d7779] focus:ring-4 focus:ring-teal-50"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword((value) => !value)
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
        </div>

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

        {mode === "signup" && (
          <div className="space-y-2 text-xs text-slate-500">
            <p className="font-medium text-[#123b3d]">
              Your password should contain:
            </p>

            <div className="flex gap-2">
              <span className="text-emerald-600">
                ✓ 8+ characters
              </span>

              <span className="text-emerald-600">
                ✓ Number
              </span>
            </div>
          </div>
        )}

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

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-100" />

        <span className="text-xs text-slate-400">
          or continue with
        </span>

        <div className="h-px flex-1 bg-slate-100" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          <span className="font-bold text-red-500">
            G
          </span>

          Google
        </button>

        {/* <button className="flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
          <Github size={17} />

          GitHub
        </button> */}
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        {mode === "login"
          ? "New to Trackly?"
          : "Already have an account?"}{" "}
        <button
          onClick={() =>
            setMode(
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

function Input({
  label,
  placeholder,
  icon,
  type = "text",
}: {
  label: string;
  placeholder: string;
  icon: React.ReactNode;
  type?: string;
}) {
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
          placeholder={placeholder}
          className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0d7779] focus:ring-4 focus:ring-teal-50"
        />
      </div>
    </div>
  );
}