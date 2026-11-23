import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { HomeScreen } from '../screens/HomeScreen';
import { useBookingStore } from '../store/bookingStore';

describe('Home Screen & Booking Flow (Phase B)', () => {
  const navigationMock = {
    navigate: jest.fn(),
    goBack: jest.fn(),
  };

  beforeEach(() => {
    useBookingStore.getState().resetBooking();
  });

  test('HomeScreen renders hero map and search bar', async () => {
    const { getByTestId, getByLabelText } = await render(
      <HomeScreen navigation={navigationMock} />,
    );

    const map = getByTestId('home-map-view');
    expect(map).toBeTruthy();

    const searchTrigger = getByLabelText('Where to in Mumbai?');
    expect(searchTrigger).toBeTruthy();
  });

  test('Selecting a drop location displays vehicle selection and server quote', async () => {
    const { getByText, queryByText } = await render(
      <HomeScreen navigation={navigationMock} />,
    );

    // Set drop programmatically to transition to quote state
    await act(async () => {
      useBookingStore.getState().setDrop({
        name: 'BKC',
        address: 'Bandra Kurla Complex, Mumbai',
        coordinates: [72.8687, 19.0657],
      });
    });

    await waitFor(() => {
      expect(useBookingStore.getState().drop).toBeTruthy();
      expect(getByText('Bike')).toBeTruthy();
      expect(getByText('Auto')).toBeTruthy();
      expect(getByText('Cab')).toBeTruthy();
    });
  });

  test('Executing Instant Booking transitions to Searching state with Trip PIN', async () => {
    const { getByText, getByRole } = await render(
      <HomeScreen navigation={navigationMock} />,
    );

    await act(async () => {
      useBookingStore.getState().setDrop({
        name: 'BKC',
        address: 'Bandra Kurla Complex, Mumbai',
        coordinates: [72.8687, 19.0657],
      });
    });

    const bookButton = getByRole('button', { name: 'Book Instant Vrumm' });
    expect(bookButton).toBeTruthy();

    await act(async () => {
      fireEvent.press(bookButton);
    });

    await waitFor(() => {
      expect(useBookingStore.getState().currentBooking).toBeTruthy();
      expect(getByText('START RIDE OTP / PIN')).toBeTruthy();
    });
  });
});
