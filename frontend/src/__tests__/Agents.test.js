import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Agents from '../pages/Agents';

const AgentsWrapper = ({ children }) => (
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

describe('Agents Component', () => {
  test('renders agents list', async () => {
    render(
      <AgentsWrapper>
        <Agents />
      </AgentsWrapper>
    );

    expect(screen.getByText('Agents Management')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add agent/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });
  });

  test('opens add agent modal', async () => {
    const user = userEvent.setup();
    render(
      <AgentsWrapper>
        <Agents />
      </AgentsWrapper>
    );

    const addButton = screen.getByRole('button', { name: /add agent/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Add New Agent')).toBeInTheDocument();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
  });

  test('validates agent form fields', async () => {
    const user = userEvent.setup();
    render(
      <AgentsWrapper>
        <Agents />
      </AgentsWrapper>
    );

    await user.click(screen.getByRole('button', { name: /add agent/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Add New Agent')).toBeInTheDocument();
    });

    const createButton = screen.getByRole('button', { name: /create agent/i });
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Mobile is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
    });
  });

  test('validates mobile number format', async () => {
    const user = userEvent.setup();
    render(
      <AgentsWrapper>
        <Agents />
      </AgentsWrapper>
    );

    await user.click(screen.getByRole('button', { name: /add agent/i }));
    
    const mobileInput = screen.getByLabelText(/mobile number/i);
    await user.type(mobileInput, '1234567890');
    await user.tab();

    await waitFor(() => {
      expect(screen.getByText(/mobile must include country code/i)).toBeInTheDocument();
    });
  });

  test('creates new agent successfully', async () => {
    const user = userEvent.setup();
    render(
      <AgentsWrapper>
        <Agents />
      </AgentsWrapper>
    );

    await user.click(screen.getByRole('button', { name: /add agent/i }));

    await user.type(screen.getByLabelText(/full name/i), 'Test Agent');
    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/mobile number/i), '+1234567890');
    await user.type(screen.getByLabelText(/password/i), 'password123');

    await user.click(screen.getByRole('button', { name: /create agent/i }));

    await waitFor(() => {
      expect(screen.getByText('Agent created successfully')).toBeInTheDocument();
    });
  });
});