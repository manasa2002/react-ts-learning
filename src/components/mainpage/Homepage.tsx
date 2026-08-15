import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock3, LockKeyhole, Play, Rocket, Users, } from "lucide-react";
import { ProductPreview } from "./ProductPreview";
import { AuthPanel } from "./AuthPanel";

type AuthMode = "login" | "signup";

export function HomePage() {
  const [authMode, setAuthMode] = useState<AuthMode>("login");

  return (
    <main className="min-h-screen overflow-hidden bg-[#f8faf9]">
      {/* NAVBAR */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#0d5558] text-xl font-bold text-white shadow-lg shadow-teal-900/10">
            T
          </div>

          <span className="text-2xl font-bold tracking-tight text-[#123b3d]">
            Trackly
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 text-sm font-medium text-slate-600 lg:flex">
          <a
            href="#features"
            className="transition hover:text-[#0d7779]"
          >
            Features
          </a>

          <a
            href="#how-it-works"
            className="transition hover:text-[#0d7779]"
          >
            How it works
          </a>

          <a
            href="#solutions"
            className="transition hover:text-[#0d7779]"
          >
            Solutions
          </a>

          <a
            href="#pricing"
            className="transition hover:text-[#0d7779]"
          >
            Pricing
          </a>

          <a
            href="#resources"
            className="transition hover:text-[#0d7779]"
          >
            Resources
          </a>
        </div>

        {/* Nav Actions */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setAuthMode("login")}
            className="hidden text-sm font-semibold text-slate-700 transition hover:text-[#0d7779] sm:block"
          >
            Log in
          </button>

          <button
            onClick={() => setAuthMode("signup")}
            className="rounded-xl bg-[#0d5558] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/10 transition hover:-translate-y-0.5 hover:bg-[#09484b]"
          >
            Sign up free
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="mx-auto grid max-w-7xl gap-12 px-6 pb-20 pt-10 lg:grid-cols-[1fr_1.05fr] lg:px-10 lg:pt-16">
        {/* LEFT */}
        <div className="flex flex-col justify-center">
          <div className="mb-7 inline-flex w-fit items-center gap-2 rounded-full border border-teal-100 bg-teal-50 px-4 py-2 text-sm font-medium text-[#0d7779]">
            <span className="h-2 w-2 rounded-full bg-[#ff8f7a]" />
            Real-time updates are live
          </div>

          <h1 className="max-w-2xl text-5xl font-bold leading-[1.05] tracking-tight text-[#123b3d] sm:text-6xl lg:text-7xl">
            Plan.
            <br />
            Track.
            <br />
            Collaborate.
            <br />

            <span className="text-[#ef8b7a]">
              Deliver Better.
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
            Trackly helps modern teams manage projects,
            track issues, collaborate effortlessly, and
            deliver amazing products faster.
          </p>

          {/* CTA */}
          <div className="mt-9 flex flex-wrap gap-4">
            <button
              onClick={() => setAuthMode("signup")}
              className="group flex items-center gap-3 rounded-xl bg-[#0d5558] px-6 py-4 font-semibold text-white shadow-xl shadow-teal-900/15 transition hover:-translate-y-1 hover:bg-[#09484b]"
            >
              Get started free

              <ArrowRight
                size={18}
                className="transition group-hover:translate-x-1"
              />
            </button>

            <button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-6 py-4 font-semibold text-[#123b3d] shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <Play size={17} />

              View demo
            </button>
          </div>

          {/* FEATURES */}
          <div className="mt-14 grid max-w-2xl grid-cols-2 gap-6 sm:grid-cols-4">
            <MiniFeature
              icon={<Users size={19} />}
              title="Collaboration"
            />

            <MiniFeature
              icon={<CheckCircle2 size={19} />}
              title="Smart tracking"
            />

            <MiniFeature
              icon={<LockKeyhole size={19} />}
              title="Secure"
            />

            <MiniFeature
              icon={<Rocket size={19} />}
              title="Ship faster"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative">
          {/* Decorative blobs */}
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-[#d9efea] blur-3xl" />

          <div className="absolute bottom-0 left-0 h-60 w-60 rounded-full bg-[#ffe0d8] blur-3xl" />

          {/* Product Preview */}
          <ProductPreview />

          {/* Floating Analytics Card */}
          <div className="absolute -bottom-8 -left-5 hidden w-52 rounded-2xl border border-white/70 bg-white/90 p-5 shadow-xl backdrop-blur sm:block">
            <div className="text-xs font-medium text-slate-500">
              Tasks completed
            </div>

            <div className="mt-2 flex items-end justify-between">
              <span className="text-3xl font-bold text-[#123b3d]">
                128
              </span>

              <span className="text-sm font-semibold text-emerald-600">
                +24%
              </span>
            </div>

            <div className="mt-4 flex h-10 items-end gap-1">
              {[20, 35, 25, 50, 42, 70, 58, 82, 65, 100].map(
                (height, index) => (
                  <div
                    key={index}
                    style={{ height: `${height}%` }}
                    className="flex-1 rounded-t bg-[#79c9b6]"
                  />
                ),
              )}
            </div>
          </div>
        </div>
      </section>

      {/* AUTH + BENEFITS */}
      <section className="border-t border-slate-100 bg-white px-6 py-20 lg:px-10">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_430px]">
          {/* LEFT */}
          <div>
            <span className="rounded-full bg-[#edf8f5] px-4 py-2 text-sm font-semibold text-[#0d7779]">
              Built for modern teams
            </span>

            <h2 className="mt-6 max-w-xl text-4xl font-bold leading-tight text-[#123b3d] sm:text-5xl">
              Everything your team needs to move from idea to delivery.
            </h2>

            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600">
              Plan work, assign tasks, collaborate with your team,
              monitor progress, and ship products without losing
              visibility.
            </p>

            <div className="mt-9 grid gap-5 sm:grid-cols-2">
              <Benefit
                icon={<Users />}
                title="Team collaboration"
                description="Keep everyone aligned with shared tasks and updates."
              />

              <Benefit
                icon={<Clock3 />}
                title="Real-time tracking"
                description="Know what is happening across every project."
              />

              <Benefit
                icon={<Rocket />}
                title="Faster delivery"
                description="Turn your workflow into a predictable process."
              />

              <Benefit
                icon={<LockKeyhole />}
                title="Secure workspace"
                description="Role-based access keeps your data protected."
              />
            </div>
          </div>

          {/* AUTH */}
          <AuthPanel
            mode={authMode}
            setMode={setAuthMode}
          />
        </div>
      </section>
    </main>
  );
}

function MiniFeature({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf8f5] text-[#0d7779]">
        {icon}
      </div>

      <span className="text-sm font-semibold text-[#123b3d]">
        {title}
      </span>
    </div>
  );
}

function Benefit({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-[#fbfcfb] p-5 transition hover:-translate-y-1 hover:shadow-lg">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#edf8f5] text-[#0d7779]">
        {icon}
      </div>

      <h3 className="mt-4 font-semibold text-[#123b3d]">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}