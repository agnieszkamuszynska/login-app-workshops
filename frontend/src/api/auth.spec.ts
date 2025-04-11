import { describe, expect, test, beforeEach, jest } from '@jest/globals';
import { loginUser } from './auth.js';

const mockedFetch = jest.fn() as jest.MockedFunction<typeof fetch>;
globalThis.fetch = mockedFetch;

describe('loginUser', () => {
  beforeEach(() => {
    mockedFetch.mockClear();
  });


//   testing the frontend client code that makes API calls. It verifies that:

//   The loginUser function correctly formats the request
//   It properly extracts the token from a successful response
//   It handles API responses appropriately

  test('should return token on successful login', async () => {
    mockedFetch.mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ token: 'fake-token' })
      } as unknown as Response);
    const result = await loginUser('test@example.com', 'password');

    expect(result).toBe('fake-token');
    expect(mockedFetch).toHaveBeenCalledWith('http://localhost:8000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password' })
    });
  });


  //verifying that your client properly displays whatever error the server sends
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

  test('should propagate other errors', async () => {
    const error = new Error('Some other error');
    mockedFetch.mockRejectedValueOnce(error);

    await expect(loginUser('test@example.com', 'password'))
      .rejects.toThrow('Some other error');
  });
});