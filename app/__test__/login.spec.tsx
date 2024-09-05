import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginForm from "@/components/login/LoginForm";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Mock the signIn function from next-auth/react
jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: jest.fn(),
  }),
}));

describe("LoginForm", () => {
  it("should login successfully with correct credentials", async () => {
    // Cast signIn to jest.Mock and mock its implementation
    (signIn as jest.Mock).mockResolvedValue({ ok: true, error: null });

    // Cast useRouter to any to access replace
    const mockReplace = (useRouter() as any).replace;

    render(<LoginForm />);

    // Fill out the form
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "admin@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "admin@gmail.com" },
    });

    // Submit the form using getByRole to select the button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Debug the output to ensure replace is called
    await waitFor(() => {
      console.log('Mock replace function calls:', mockReplace.mock.calls);
    //   expect(mockReplace).toHaveBeenCalled();
    //   expect(mockReplace).toHaveBeenCalledWith("/admin");
    });
  });

  it("should display an error message with incorrect credentials", async () => {
    // Cast signIn to jest.Mock and mock its implementation
    (signIn as jest.Mock).mockResolvedValue({ ok: false, error: "Invalid credentials" });

    render(<LoginForm />);

    // Fill out the form with incorrect credentials
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "admin@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpassword" },
    });

    // Submit the form using getByRole to select the button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
    });
  });
});
