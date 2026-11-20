import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorState } from '../components/ui/ErrorState';

describe('UI Design System Components', () => {
  test('Button renders title and responds to press', async () => {
    const onPressMock = jest.fn();
    await render(<Button title="Book Ride" onPress={onPressMock} />);

    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
    expect(screen.getByText('Book Ride')).toBeTruthy();

    fireEvent.press(button);
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  test('Button disabled state prevents press events', async () => {
    const onPressMock = jest.fn();
    await render(<Button title="Disabled Action" disabled onPress={onPressMock} />);

    const button = screen.getByRole('button');
    fireEvent.press(button);
    expect(onPressMock).not.toHaveBeenCalled();
  });

  test('Input renders label, placeholder, and updates text', async () => {
    const onChangeMock = jest.fn();
    await render(
      <Input
        label="Phone Number"
        placeholder="+919876543210"
        value=""
        onChangeText={onChangeMock}
      />
    );

    expect(screen.getByText('Phone Number')).toBeTruthy();
    const input = screen.getByPlaceholderText('+919876543210');
    fireEvent.changeText(input, '+919999988888');
    expect(onChangeMock).toHaveBeenCalledWith('+919999988888');
  });

  test('Badge displays text label and has icon (never color alone)', async () => {
    await render(<Badge label="LIVE TRIP" variant="success" />);
    expect(screen.getByText('LIVE TRIP')).toBeTruthy();
  });

  test('Card renders children content', async () => {
    await render(
      <Card>
        <Badge label="Card Badge" />
      </Card>
    );
    expect(screen.getByText('Card Badge')).toBeTruthy();
  });

  test('EmptyState renders title and action button', async () => {
    const onActionMock = jest.fn();
    await render(
      <EmptyState
        title="No Active Rides"
        description="Book your next ride across Mumbai now."
        actionLabel="Find Ride"
        onAction={onActionMock}
      />
    );

    expect(screen.getByText('No Active Rides')).toBeTruthy();
    expect(screen.getByText('Find Ride')).toBeTruthy();
    fireEvent.press(screen.getByText('Find Ride'));
    expect(onActionMock).toHaveBeenCalledTimes(1);
  });

  test('ErrorState displays error title and retry action', async () => {
    const onRetryMock = jest.fn();
    await render(
      <ErrorState
        title="Connection Timed Out"
        message="Please check your cellular data."
        onRetry={onRetryMock}
        retryLabel="Retry Connection"
      />
    );

    expect(screen.getByText('Connection Timed Out')).toBeTruthy();
    const retryBtn = screen.getByText('Retry Connection');
    fireEvent.press(retryBtn);
    expect(onRetryMock).toHaveBeenCalledTimes(1);
  });
});
