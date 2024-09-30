import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import LoginForm from "../../components/login/LoginForm";
import loaderStore from "../stores/loaderStore";

// Mock next-auth/react's signIn function
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

// Mock loaderStore
jest.mock('../../app/stores/loaderStore', () => ({
  show: jest.fn(),
  hide: jest.fn(),
}))

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}))

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks() // Reset all mocks before each test
  })

  it('renders the login form', () => {
    render(<LoginForm />)

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument()
  })

  it('shows an error if fields are empty', async () => {
    render(<LoginForm />)

    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(loaderStore.show).toHaveBeenCalled()
      expect(screen.getByText('All fields are necessary.')).toBeInTheDocument()
      expect(loaderStore.hide).toHaveBeenCalled()
    })
  })

  it('shows an error if user does not exist', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ userExits: false }),
      })
    ) as jest.Mock

    render(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'admin12345@gmail.com' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'admin12345@gmail.com' } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid Credentials')).toBeInTheDocument()
      expect(loaderStore.hide).toHaveBeenCalled()
    })
  })

  it('shows an error if account is inactive', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ userExits: true, active: false }),
      })
    ) as jest.Mock

    render(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'admin@gmail.com' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'admin@gmail.com' } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText('This Account is inActive')).toBeInTheDocument()
      expect(loaderStore.hide).toHaveBeenCalled()
    })
  })

  it('calls signIn on successful login', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ userExits: true, active: true }),
      })
    ) as jest.Mock

    const mockSignIn = signIn as jest.Mock
    mockSignIn.mockResolvedValue({ error: null })

    render(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'admin@gmail.com' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'admin@gmail.com' } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith('credentials', {
        email: 'admin@gmail.com',
        password: 'admin@gmail.com',
        redirect: false,
      })
      expect(loaderStore.hide).toHaveBeenCalled()
    })
  })

  it('shows an error if login fails', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ userExits: true, active: true }),
      })
    ) as jest.Mock

    const mockSignIn = signIn as jest.Mock
    mockSignIn.mockResolvedValue({ error: 'Invalid Credentials' })

    render(<LoginForm />)

    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'admin12345@gmail.com' } })
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'admin12345@gmail.com' } })
    fireEvent.click(screen.getByRole("button", { name: /login/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid Credentials')).toBeInTheDocument()
      expect(loaderStore.hide).toHaveBeenCalled()
    })
  })
})
