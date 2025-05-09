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
    const tokenInfo = 'eyJhbGci0iJI';
    (useLocation as jest.Mock).mockReturnValue({
      state: { token: tokenInfo }
    });

    (jwtDecode as jest.Mock).mockReturnValue({
      user_id: 1,
      user_name: 'Alice',
    });

    render(<WelcomeDashboard />);

    expect(screen.getByRole('heading', { name: /Welcome, Alice/i })).toBeInTheDocument();

    const paragraphs = screen.getAllByRole('paragraph');
    const userIdParagraph = paragraphs.find(p => p.textContent?.includes('User ID:'));
    const usernameParagraph = paragraphs.find(p => p.textContent?.includes('Username:'));

    expect(userIdParagraph).toHaveTextContent('1');
    expect(usernameParagraph).toHaveTextContent('Alice');
    expect(screen.getByText(/You are logged in!/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Logout'})).toBeInTheDocument();
    expect(screen.getByText(/Token:/)).toHaveTextContent(`${tokenInfo}`);

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
      state: { token: 'eyJhbGci0iJI' }
    });

    (jwtDecode as jest.Mock).mockReturnValue({
      user_id: 1,
      user_name: 'Alice',
    });

    render(<WelcomeDashboard />);

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});