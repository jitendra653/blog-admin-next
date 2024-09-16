'use client'

import Link from 'next/link'
import { useRegisterForm } from './useRegisterForm'
import React from 'react'

export default function RegisterForm() {
  const { name, email, password, error, handleInputChange, handleSubmit, resetForm } = useRegisterForm()

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-violet-600">
        <h1 className="text-xl font-bold my-4">Register</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            name="name"
            value={name}
            onChange={handleInputChange}
            type="text"
            placeholder="Full Name"
            data-testid="name-input"
            className="border p-2 rounded"
          />
          <input
            name="email"
            value={email}
            onChange={handleInputChange}
            type="email"
            placeholder="Email"
            data-testid="email-input"
            className="border p-2 rounded"
          />
          <input
            name="password"
            value={password}
            onChange={handleInputChange}
            type="password"
            placeholder="Password"
            data-testid="password-input"
            className="border p-2 rounded"
          />

          <div className="flex gap-3 mt-3">
            <button
              data-testid="register-button"
              type="submit"
              className="bg-violet-600 text-white py-2 rounded w-full"
            >
              Register
            </button>
            <button
              type="button"
              onClick={resetForm} // Call resetForm on click
              className="bg-gray-500 text-white py-2 rounded w-full"
            >
              Reset
            </button>
          </div>
          {error && <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">{error}</div>}
          <Link data-testid="login-link" className="text-sm mt-3 text-right" href="/">
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  )
}
