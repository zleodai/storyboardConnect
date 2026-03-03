import React from 'react';
import { useAuth } from '../../hooks/useAuth';

interface SignInPageProps {
  onContinueWithoutSignIn: () => void;
}

export const SignInPage: React.FC<SignInPageProps> = ({ onContinueWithoutSignIn }) => {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="flex-1 min-h-screen bg-[radial-gradient(circle_at_top,_#232323_0%,_#111111_45%,_#080808_100%)] text-white">
      <div className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-gray-800 bg-black/40 shadow-2xl backdrop-blur-sm">
          <div className="grid md:grid-cols-[1.1fr_0.9fr]">
            <section className="border-b border-gray-800 p-10 md:border-b-0 md:border-r md:p-14">
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-gray-500">
                Storyboard Connect
              </p>
              <h1 className="mb-6 text-4xl font-bold leading-tight md:text-5xl">
                Sign in with Google and keep your creative network in one place.
              </h1>
              <p className="max-w-xl text-base leading-7 text-gray-400">
                Use Google to access saved applications, protected project actions, and a cleaner
                handoff into the platform. You can still browse first if you want to look around.
              </p>
            </section>

            <section className="flex flex-col justify-center p-10 md:p-14">
              <div className="rounded-2xl border border-gray-800 bg-[#111111] p-8">
                <p className="mb-6 text-sm font-medium text-gray-400">Account Access</p>
                <button
                  type="button"
                  onClick={loginWithGoogle}
                  className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-gray-700 bg-white px-5 py-3 text-sm font-semibold text-black transition hover:bg-gray-100"
                >
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#4285F4] text-xs font-bold text-white">
                    G
                  </span>
                  Continue with Google
                </button>
                <button
                  type="button"
                  onClick={onContinueWithoutSignIn}
                  className="w-full rounded-xl border border-gray-700 px-5 py-3 text-sm font-semibold text-gray-300 transition hover:border-white hover:text-white"
                >
                  Continue without signing in
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};
