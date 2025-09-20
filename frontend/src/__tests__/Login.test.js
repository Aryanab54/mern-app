import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';

// Mock AuthContext
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    login: jest.fn(),
    user: null,
    loading: false
  })
}));

describe('Login Component', () => {
  test('renders login form', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    expect(screen.getByText('Admin Login')).toBeInTheDocument();
  });
});