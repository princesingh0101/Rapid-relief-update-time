"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-blue-50 px-6">

      {/* Logo */}
      <div className="flex items-center gap-2 mb-6 animate-fadeIn">
        <img
          src="/rapidrelief-logo.png"
          alt="RapidRelief"
          className="w-10 h-10"
        />
        <h1 className="text-2xl font-bold text-blue-600">
          Rapid<span className="text-blue-400">Relief</span>
        </h1>
      </div>

      {/* 404 Illustration */}
      <div className="animate-float">
        <img
          src="/404-medicine.png"
          alt="404 Page"
          className="w-[500px] max-w-full"
        />
      </div>

      {/* Text */}
      <h2 className="text-3xl font-bold text-gray-800 mt-6">
        Page Not Found
      </h2>

      <p className="text-gray-500 mt-2 text-center max-w-md">
        The page you are looking for doesn't exist, it might have been moved or deleted.
      </p>

      {/* Button */}
      <button
        onClick={() => router.push("/")}
        className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        Go Home
      </button>

      {/* Animations */}
      <style jsx>{`
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-in;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

    </div>
  );
}