import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { signIn } from "next-auth/react";
import LoginForm from "../../components/login/LoginForm";

jest.mock("next-auth/react", () => ({
  signIn: jest.fn(),
}));

describe("LoginForm", () => {
  test("renders form elements", () => {
    render(<LoginForm />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
  });

  test("submits the form successfully", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: null });
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "admin@gmail.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "admin@gmail.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    await waitFor(() => {
      expect(signIn).toHaveBeenCalledWith("credentials", {
        email: "admin@gmail.com",
        password: "admin@gmail.com",
        redirect: false,
      });
    });
  });

  test("displays error message on failed login", async () => {
    (signIn as jest.Mock).mockResolvedValueOnce({ error: "Invalid Credentials" });
    render(<LoginForm />);
    fireEvent.change(screen.getByPlaceholderText("Email"), {
      target: { value: "admin@gmail.com" },
    })
    fireEvent.change(screen.getByPlaceholderText("Password"), {
      target: { value: "1231231" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText("Invalid Credentials")).toBeInTheDocument();
    });
  });


});
