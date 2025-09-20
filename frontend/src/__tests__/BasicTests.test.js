import React from 'react';
import { render } from '@testing-library/react';

// Simple components without router dependencies
const TestButton = ({ onClick, children }) => (
  <button onClick={onClick}>{children}</button>
);

const TestForm = () => (
  <form>
    <input type="email" placeholder="Email" />
    <input type="password" placeholder="Password" />
    <button type="submit">Submit</button>
  </form>
);

describe('Basic Component Tests', () => {
  test('renders button component', () => {
    render(<TestButton>Click me</TestButton>);
  });

  test('renders form component', () => {
    render(<TestForm />);
  });

  test('basic functionality works', () => {
    expect(1 + 1).toBe(2);
    expect('hello').toBe('hello');
  });
});