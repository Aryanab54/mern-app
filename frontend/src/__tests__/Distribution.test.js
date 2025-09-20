import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Distribution from '../pages/Distribution';

const DistributionWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

// Mock localStorage
const mockUser = { id: '1', email: 'admin@test.com' };
beforeEach(() => {
  localStorage.setItem('token', 'mock-token');
  localStorage.setItem('user', JSON.stringify(mockUser));
});

describe('Distribution Component', () => {
  test('shows loading state initially', () => {
    render(
      <DistributionWrapper>
        <Distribution />
      </DistributionWrapper>
    );

    expect(screen.getByText('Loading distribution data...')).toBeInTheDocument();
  });

  test('renders distribution data', async () => {
    render(
      <DistributionWrapper>
        <Distribution />
      </DistributionWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Distribution Overview')).toBeInTheDocument();
      expect(screen.getByText('Distribution Summary')).toBeInTheDocument();
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('shows total items count', async () => {
    render(
      <DistributionWrapper>
        <Distribution />
      </DistributionWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total items
      expect(screen.getByText('Total Items Distributed')).toBeInTheDocument();
    });
  });

  test('expands accordion to show agent details', async () => {
    const user = userEvent.setup();
    render(
      <DistributionWrapper>
        <Distribution />
      </DistributionWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const accordionButton = screen.getByRole('button', { name: /john doe/i });
    await user.click(accordionButton);

    await waitFor(() => {
      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('1234567890')).toBeInTheDocument();
      expect(screen.getByText('Test note 1')).toBeInTheDocument();
    });
  });

  test('shows detailed distribution table', async () => {
    const user = userEvent.setup();
    render(
      <DistributionWrapper>
        <Distribution />
      </DistributionWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    const accordionButton = screen.getByRole('button', { name: /john doe/i });
    await user.click(accordionButton);

    await waitFor(() => {
      expect(screen.getByText('First Name')).toBeInTheDocument();
      expect(screen.getByText('Phone')).toBeInTheDocument();
      expect(screen.getByText('Notes')).toBeInTheDocument();
      expect(screen.getByText('Assigned Date')).toBeInTheDocument();
    });
  });
});