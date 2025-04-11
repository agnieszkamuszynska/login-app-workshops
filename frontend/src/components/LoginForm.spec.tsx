import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LoginForm from './LoginForm';
import { useNavigate } from 'react-router-dom';

jest.mock('../api/auth', () => ({
  loginUser: jest.fn()
}));

jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn()
}));

describe('<LoginForm />', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
  });


  test('renders login form with all fields', () => {
    render(<LoginForm />);

    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByTestId('submit-button')).toBeInTheDocument();
  });

  test('shows required error when form is submitted with empty email', async () => {
    render(<LoginForm />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(await screen.findByTestId('email-error')).toHaveTextContent('Email is required');
  });

  test('shows "Enter a valid email address" error when submitting invalid email format', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(await screen.findByTestId('email-error')).toHaveTextContent('Enter a valid email address');
  });

  test('shows required error when form is submitted with empty password', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(await screen.findByTestId('password-error')).toHaveTextContent('Password is required');
  });

  test('validates password length error', async () => {
    render(<LoginForm />);

    const emailInput = screen.getByTestId('email-input');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const passwordInput = screen.getByTestId('password-input');
    fireEvent.change(passwordInput, { target: { value: 'short' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(await screen.findByTestId('password-error')).toHaveTextContent('Password must be at least 6 characters');
  });
});