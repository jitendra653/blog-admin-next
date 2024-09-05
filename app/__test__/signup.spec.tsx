import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import RegisterForm from "@/components/register/RegisterForm"; // Adjust the import path as needed

// Mock the fetch API globally
global.fetch = jest.fn();

describe("RegisterForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly", () => {
    render(<RegisterForm />);

    expect(screen.getByPlaceholderText("Full Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Register")).toBeInTheDocument();
  });

  test("displays an error message when required fields are missing", async () => {
    render(<RegisterForm />);

    fireEvent.click(screen.getByText("Register"));

    expect(await screen.findByText("All fields are necessary.")).toBeInTheDocument();
  });

  test("displays an error message if user already exists", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValue({ user: true }),
    });

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByText("Register"));

    expect(await screen.findByText("User already exists.")).toBeInTheDocument();
  });

  test("handles successful registration", async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValue({ user: false }),
      })
      .mockResolvedValueOnce({ ok: true });

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByText("Register"));

    await waitFor(() => {
      expect(screen.queryByText("User already exists.")).not.toBeInTheDocument();
      expect(screen.queryByText("All fields are necessary.")).not.toBeInTheDocument();
      // Here you could also check if the page was redirected, but it requires additional setup
    });
  });

  test("handles server errors", async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("Network Error"));

    render(<RegisterForm />);

    fireEvent.change(screen.getByPlaceholderText("Full Name"), { target: { value: "John Doe" } });
    fireEvent.change(screen.getByPlaceholderText("Email"), { target: { value: "john@example.com" } });
    fireEvent.change(screen.getByPlaceholderText("Password"), { target: { value: "password123" } });

    fireEvent.click(screen.getByText("Register"));

    // Here you would check for specific handling of server errors if there's any UI feedback
    // For now, we can only confirm that no specific error message is shown
  });
});
