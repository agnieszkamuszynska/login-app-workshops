import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './App';

// Mock the components to avoid testing their implementation details here
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
      ...originalModule,
      BrowserRouter: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
  });

  jest.mock('./components/LoginForm', () => {
    return function MockLoginForm() {
      return <div data-testid="login-form">Login Form Component</div>;
    };
  });

  jest.mock('./components/WelcomeDashboard', () => {
    return function MockWelcomeDashboard() {
      return <div data-testid="welcome-dashboard">Welcome Dashboard Component</div>;
    };
  });

describe('<App />', () => {
  test('renders LoginForm at the root path', () => {
    render(
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      );

    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.queryByTestId('welcome-dashboard')).not.toBeInTheDocument();
  });

  test('renders WelcomeDashboard at the dashboard path', () => {
    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId('welcome-dashboard')).toBeInTheDocument();
    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
  });

  test('renders 404 element for unknown routes', () => {
    render(
      <MemoryRouter initialEntries={['/unknown-route']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('login-form')).not.toBeInTheDocument();
    expect(screen.queryByTestId('welcome-dashboard')).not.toBeInTheDocument();
  });
});