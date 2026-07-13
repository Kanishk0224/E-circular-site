"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, RotateCw, HelpCircle } from "lucide-react";

// ---------------------------------------------------------------------------
// Demo credentials — replace with real auth (lib/auth.ts) once the backend
// is wired up. Each role routes to its own portal after a successful match.
// ---------------------------------------------------------------------------
const CREDENTIALS = [
  { email: "staff@kiot.ac.in", password: "staff123", role: "staff", path: "/staff" },
  { email: "hod@kiot.ac.in", password: "hod123", role: "hod", path: "/hod" },
  { email: "principal@kiot.ac.in", password: "principal123", role: "principal", path: "/principal" },
];

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.4 0 6.4 1.17 8.8 3.46l6.5-6.5C35.4 2.5 30.1 0 24 0 14.6 0 6.5 5.4 2.5 13.2l7.6 5.9C11.9 13.1 17.4 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.5 24.5c0-1.6-.15-3.1-.4-4.6H24v9.1h12.7c-.55 2.9-2.2 5.4-4.7 7l7.4 5.7C43.9 37.4 46.5 31.5 46.5 24.5z"
      />
      <path
        fill="#FBBC05"
        d="M10.1 19.1c-.5 1.4-.75 2.9-.75 4.4s.25 3 .75 4.4l-7.6 5.9C.9 30.9 0 27.5 0 23.5s.9-7.4 2.5-10.3l7.6 5.9z"
      />
      <path
        fill="#34A853"
        d="M24 47c6.1 0 11.3-2 15-5.5l-7.4-5.7c-2.1 1.4-4.7 2.2-7.6 2.2-6.6 0-12.1-4.5-14-10.5l-7.6 5.9C6.5 41.6 14.6 47 24 47z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const match = CREDENTIALS.find(
      (c) => c.email.toLowerCase() === email.trim().toLowerCase() && c.password === password
    );
    if (!match) {
      setError("Incorrect email or password.");
      return;
    }
    setError("");

    // Store a lightweight session so middleware can protect /staff, /hod,
    // /principal, and so the logout button on each portal has something
    // to clear. Cookie (not localStorage) so middleware can read it server-side.
    document.cookie = `session=${encodeURIComponent(
      JSON.stringify({ email: match.email, role: match.role })
    )}; path=/; max-age=${60 * 60 * 8}`; // 8 hour session

    router.push(match.path);
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* LEFT — dark green orbital panel */}
      <div className="relative hidden md:flex flex-col justify-between overflow-hidden bg-[#1c3a2b] px-10 py-9">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.05), transparent 45%), radial-gradient(circle at 70% 80%, rgba(0,0,0,0.25), transparent 55%)",
          }}
        />

        <div className="relative flex items-center gap-3 text-white">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40">
            <RotateCw className="h-4 w-4" />
          </span>
          <span className="text-lg">e-Circular</span>
        </div>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="relative h-[340px] w-[340px]">
            {/* outer dashed orbit */}
            <div className="absolute inset-0 rounded-full border border-dashed border-white/15" />
            {/* solid orbit ring */}
            <div className="absolute inset-[35px] rounded-full border border-white/25" />
            {/* orbit dots, slowly spinning */}
            <div className="absolute inset-[35px] animate-[spin_18s_linear_infinite]">
              <span className="absolute -top-[3px] left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-white/70" />
              <span className="absolute top-1/4 right-0 h-1.5 w-1.5 rounded-full bg-white/50" />
              <span className="absolute bottom-1/4 left-0 h-1.5 w-1.5 rounded-full bg-white/40" />
              <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 h-2 w-2 rotate-45 bg-white/70" />
            </div>
            {/* inner glow rings + center icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-white/10">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/30 bg-[#7a1f1f]/90">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#c22b2b]">
                    <svg width="18" height="20" viewBox="0 0 24 28" fill="none">
                      <rect x="1" y="1" width="22" height="26" rx="2.5" fill="white" />
                      <line x1="5" y1="8" x2="19" y2="8" stroke="#c22b2b" strokeWidth="1.6" />
                      <line x1="5" y1="13" x2="19" y2="13" stroke="#c22b2b" strokeWidth="1.6" />
                      <line x1="5" y1="18" x2="14" y2="18" stroke="#c22b2b" strokeWidth="1.6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div />
      </div>

      {/* RIGHT — form panel */}
      <div className="relative flex items-center justify-center bg-[#f5f4ef] px-6 py-12 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 10%, rgba(28,58,43,0.06), transparent 40%), radial-gradient(circle at 60% 90%, rgba(28,58,43,0.05), transparent 40%)",
          }}
        />

        <div className="relative w-full max-w-md">
          <p className="text-xs font-medium tracking-[0.15em] text-slate-500 mb-3">
            PORTAL ACCESS
          </p>
          <h1 className="font-serif text-4xl text-slate-900 mb-3">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-8 leading-relaxed">
            Sign in to manage your circulars, track resources, and connect with your network.
          </p>

          <div className="bg-white rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.06)] p-7">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm text-slate-700 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organisation.org"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/60 pl-10 pr-3 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#1c3a2b] focus:ring-1 focus:ring-[#1c3a2b]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-slate-200 bg-slate-50/60 pl-10 pr-10 py-2.5 text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:border-[#1c3a2b] focus:ring-1 focus:ring-[#1c3a2b]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600">
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className="h-4 w-4 rounded-full border-slate-300 accent-[#1c3a2b]"
                  />
                  Remember me
                </label>
                <a href="#" className="text-[#1c3a2b] font-medium hover:underline">
                  Forgot password?
                </a>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                className="w-full rounded-full bg-[#1c3a2b] py-3 text-sm font-semibold text-white hover:bg-[#163023] transition-colors"
              >
                Sign in to Portal
              </button>
            </form>

            <div className="flex items-center gap-3 my-6">
              <span className="h-px flex-1 bg-slate-200" />
              <span className="text-xs text-slate-400">or continue with</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>

            <button className="w-full flex items-center justify-center gap-2.5 rounded-full border border-slate-200 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
              <GoogleIcon />
              Sign in with Google Workspace
            </button>
          </div>

          <p className="text-center text-sm text-slate-400 mt-6">
            New to the platform?{" "}
            <a href="#" className="text-slate-700 font-medium hover:underline">
              Request access
            </a>{" "}
            ·{" "}
            <a href="#" className="text-slate-700 font-medium hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>

        <button className="fixed bottom-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-slate-800 text-white shadow-lg hover:bg-slate-900">
          <HelpCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}