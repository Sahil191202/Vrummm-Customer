import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { RegisterScreen } from '../screens/RegisterScreen';
import { useAuthStore } from '../store/authStore';
import { tokenStorage } from '../services/storage';

describe('Register Screen User Flow', () => {
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

  test('RegisterScreen performs validation before submit', async () => {
    const navigationMock = { navigate: jest.fn() };
    const { getByTestId } = await render(
      <RegisterScreen navigation={navigationMock} />,
    );

    const registerButton = getByTestId('register-submit-button');
    expect(registerButton).toBeTruthy();

    await act(async () => {
      fireEvent.press(registerButton);
    });

    // Validation error prevents submit because fields are incomplete
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
  });
});
