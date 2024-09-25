'use client'

import Link from 'next/link'
import { useState, ChangeEvent, FormEvent } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import loaderStore from '../../app/stores/loaderStore'
import React from 'react'

export default function LoginForm() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const router = useRouter()
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    loaderStore.show()

    const resUserActive = await fetch('/api/userActive', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    const { user }: { user: boolean } = await resUserActive.json()

    if (user) {
      loaderStore.hide()
      try {
        const res = await signIn('credentials', {
          email,
          password,
          redirect: false,
        })
        if (res?.error) {
          setError('Invalid Credentials')
          loaderStore.hide()
          return
        }
        router.replace('/admin')
        loaderStore.hide()
      } catch (error) {
        console.error('Login error:', error)
      }
    } else {
      setError('This Account is inActive')
      loaderStore.hide()
      return
    }
  }

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-violet-600">
        <h1 className="text-xl font-bold my-4">Login</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
            value={email}
          />
          <input
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            value={password}
          />
          <button
            type="submit"
            className="bg-violet-600 hover:bg-violet-900 hover:border-violet-600 text-white font-bold cursor-pointer px-6 py-2"
          >
            Login
          </button>
          {error && <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">{error}</div>}
          <Link className="text-sm mt-3 text-right" href="/register">
            Don't have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  )
}
