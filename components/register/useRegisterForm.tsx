import { useState, ChangeEvent, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import loaderStore from '../../app/stores/loaderStore'

export const useRegisterForm = () => {
  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    switch (name) {
      case 'name':
        setName(value)
        break
      case 'email':
        setEmail(value)
        break
      case 'password':
        setPassword(value)
        break
      default:
        break
    }
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setError('')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    loaderStore.show()

    if (!name || !email || !password) {
      setError('All fields are necessary.')
      loaderStore.hide()
      return
    }

    try {
      const resUserExists = await fetch('/api/userExists', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const { user }: { user: boolean } = await resUserExists.json()

      if (user) {
        setError('User already exists.')
        loaderStore.hide()
        return
      }

      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      })

      if (res.ok) {
        resetForm()
        router.push('/')
      } else {
        setError('User registration failed.')
      }
      loaderStore.hide()
    } catch (error) {
      loaderStore.hide()
      setError('Error during registration.')
      console.error(error)
    }
  }

  return {
    name,
    email,
    password,
    error,
    handleInputChange,
    handleSubmit,
    resetForm,
  }
}
