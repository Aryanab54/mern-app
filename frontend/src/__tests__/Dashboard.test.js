import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from '../pages/Dashboard';

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const DashboardWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      {children}
    </AuthProvider>
  </BrowserRouter>
);

describe('Dashboard Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('renders dashboard with welcome message', () => {
    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    expect(screen.getByText('Welcome back, Admin!')).toBeInTheDocument();
  });

  test('displays statistics cards', async () => {
    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Total Agents')).toBeInTheDocument();
      expect(screen.getByText('Total Lists')).toBeInTheDocument();
    });
  });

  test('navigates to agents page', async () => {
    const user = userEvent.setup();
    render(
      <DashboardWrapper>
        <Dashboard />
      </DashboardWrapper>
    );

    const agentsButton = screen.getByRole('button', { name: /go to agents/i });
    await user.click(agentsButton);

    expect(mockNavigate).toHaveBeenCalledWith('/agents');
  });
});