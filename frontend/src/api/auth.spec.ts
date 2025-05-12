import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { loginUser } from './auth.js';

const mockedFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
globalThis.fetch = mockedFetch;


//testing the frontend client code that makes API calls and handle properly interactions with the backend
describe('loginUser', () => {
  beforeEach(() => {
    mockedFetch.mockClear();
  });

  test('should call correct endpoint with the correct arguments', async () => {
    mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ token: 'token' })
      } as unknown as Response);

      //loginUser function handle authentication by sending a request to the backend API
     await loginUser('test@example.com', 'password');

    //after successful login, we expect the fn is called with the correct arguments
    expect(mockedFetch).toHaveBeenCalledWith('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' })
    });
  });


  //verifying that client properly displays error the server sends
  test('should throw error with server message on login failure', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ detail: 'Invalid credentials' })
    } as unknown as Response);

    await expect(loginUser('test@example.com', 'wrong-password'))
      .rejects.toThrow('Invalid credentials');
  });

  test('should throw default error message on login failure without detail', async () => {
    mockedFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({})
    } as unknown as Response);

    await expect(loginUser('test@example.com', 'wrong-password'))
      .rejects.toThrow('Login failed');
  });

  test('should throw standardized error message on network failure', async () => {
    mockedFetch.mockRejectedValueOnce(new TypeError('Network error'));

    await expect(loginUser('test@example.com', 'password'))
      .rejects.toThrow('Oops! Something went wrong. Please try again later.');
  });
});