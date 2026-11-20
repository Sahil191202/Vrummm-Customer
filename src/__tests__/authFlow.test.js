import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { LoginScreen } from '../screens/LoginScreen';
import { useAuthStore } from '../store/authStore';
import { tokenStorage } from '../services/storage';

describe('Login Screen User Flow', () => {
  beforeEach(async () => {
    await tokenStorage.clearTokens();
    useAuthStore.setState({
      user: null,
      customerProfile: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  afterEach(async () => {
    await tokenStorage.clearTokens();
  });

  test('LoginScreen renders and allows login submission', async () => {
    const navigationMock = { navigate: jest.fn() };
    const { getByRole, getByPlaceholderText } = await render(
      <LoginScreen navigation={navigationMock} />,
    );

    const emailInput = getByPlaceholderText('customer@vrumm.local');
    const passwordInput = getByPlaceholderText('Minimum 8 characters');

    fireEvent.changeText(emailInput, 'customer@vrumm.local');
    fireEvent.changeText(passwordInput, 'password123');

    const loginButton = getByRole('button', { name: 'Log In' });

    await act(async () => {
      fireEvent.press(loginButton);
    });

    await waitFor(
      () => {
        expect(useAuthStore.getState().isAuthenticated).toBe(true);
      },
      { timeout: 3000 },
    );
  });
});
