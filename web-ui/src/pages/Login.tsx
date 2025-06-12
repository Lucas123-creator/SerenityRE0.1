import React from 'react';

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="card w-full max-w-md p-8 bg-white/70 backdrop-blur-xl border-0 shadow-xl rounded-2xl">
        <h1 className="text-3xl font-extrabold mb-2 text-center text-gray-900">Sign in to RealEstate Serenity</h1>
        <p className="text-lg text-gray-500 mb-6 text-center">Welcome back! Please enter your credentials to continue.</p>
        <form className="space-y-4">
          <input className="input" type="email" placeholder="Email address" required />
          <input className="input" type="password" placeholder="Password" required />
          <button className="btn btn-primary w-full" type="submit">Sign In</button>
        </form>
      </div>
    </div>
  );
} 