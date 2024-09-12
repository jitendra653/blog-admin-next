import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from "../../components/register/RegisterForm"; // Adjust the import path as needed

describe('RegisterForm Component', () => {
  test('renders the register form', () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText('Full Name')).toBeVisible();
    expect(screen.getByPlaceholderText('Email')).toBeVisible();
    expect(screen.getByPlaceholderText('Password')).toBeVisible();
    expect(screen.getByRole('button', { name: /Register/i })).toBeVisible();
    expect(screen.getByText("Already have an account?")).toBeVisible();
  });

  test('displays error message when fields are missing', async () => {
    render(<RegisterForm />);

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(await screen.findByText('All fields are necessary.')).toBeInTheDocument();
  });

  test('displays error message if user already exists', async () => {
    global.fetch = jest.fn((url: string) => {
      if (url.includes('/api/userExists')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: true }),
        });
      }

      if (url.includes('/api/register')) {
        return Promise.resolve({ ok: false });
      }

      return Promise.reject('Not Found');
    }) as jest.Mock;

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Jitendra' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'admin@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'admin@gmail.com' } });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));

    expect(await screen.findByText('User already exists.')).toBeInTheDocument();
  });

  test('successfully registers a new user and redirects', async () => {
    global.fetch = jest.fn((url: string) => {
      if (url.includes('/api/userExists')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ user: false }),
        });
      }

      if (url.includes('/api/register')) {
        return Promise.resolve({ ok: true });
      }

      return Promise.reject('Not Found');
    }) as jest.Mock;

    const { container } = render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText('Full Name'), { target: { value: 'Jitendra' } });
    fireEvent.change(screen.getByPlaceholderText('Email'), { target: { value: 'jitendra@gmail.com' } });
    fireEvent.change(screen.getByPlaceholderText('Password'), { target: { value: 'Admin@123' } });

    fireEvent.click(screen.getByRole('button', { name: /Register/i }));
    await waitFor(() => {
      expect(screen.queryByPlaceholderText('Full Name')).toHaveValue('');
      expect(screen.queryByPlaceholderText('Email')).toHaveValue('');
      expect(screen.queryByPlaceholderText('Password')).toHaveValue('');
    });
  });

  test('navigates to login page when the login link is clicked', () => {
    render(<RegisterForm />);
    fireEvent.click(screen.getByText("Already have an account?"));
  });
});
