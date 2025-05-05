import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WelcomeDashboard from './WelcomeDashboard';
import { useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
  useNavigate: jest.fn()
}));

jest.mock('jwt-decode', () => ({
  jwtDecode: jest.fn()
}));

describe('<WelcomeDashboard />', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test('renders user information when token is valid', () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: { token: 'valid-token-123' }
    });

    (jwtDecode as jest.Mock).mockReturnValue({
      user_id: 42,
      user_name: 'John Doe',
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour from now
      iat: Math.floor(Date.now() / 1000)
    });

    render(<WelcomeDashboard />);

    expect(screen.getByRole('heading', { name: /Welcome, John Doe/i })).toBeInTheDocument();

    const paragraphs = screen.getAllByRole('paragraph');
    const userIdParagraph = paragraphs.find(p => p.textContent?.includes('User ID:'));
    const usernameParagraph = paragraphs.find(p => p.textContent?.includes('Username:'));

    expect(userIdParagraph).toHaveTextContent('42');
    expect(usernameParagraph).toHaveTextContent('John Doe');
    expect(screen.getByText(/You are logged in!/i)).toBeInTheDocument();
});

  test('redirects to home when token is missing', () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: null
    });

    render(<WelcomeDashboard />);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('redirects to home when token is invalid', () => {
    (useLocation as jest.Mock).mockReturnValue({
      state: { token: 'invalid-token' }
    });

    (jwtDecode as jest.Mock).mockImplementation(() => {
      throw new Error('Invalid token');
    });

    render(<WelcomeDashboard />);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('logs out when logout button is clicked', () => {

    (useLocation as jest.Mock).mockReturnValue({
      state: { token: 'valid-token-123' }
    });


    (jwtDecode as jest.Mock).mockReturnValue({
      user_id: 42,
      user_name: 'John Doe',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    });

    render(<WelcomeDashboard />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  test('displays shortened token', () => {
    const longToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo0MiwidXNlcl9uYW1lIjoiSm9obiBEb2UiLCJleHAiOjE2MTYxODEyMDAsImlhdCI6MTYxNjE3NzYwMH0';

    (useLocation as jest.Mock).mockReturnValue({
      state: { token: longToken }
    });

    (jwtDecode as jest.Mock).mockReturnValue({
      user_id: 42,
      user_name: 'John Doe',
      exp: Math.floor(Date.now() / 1000) + 3600,
      iat: Math.floor(Date.now() / 1000)
    });

    render(<WelcomeDashboard />);

    expect(screen.getByText(/🔐 Token:/)).toHaveTextContent(`${longToken.substring(0, 12)}...`);
  });
});