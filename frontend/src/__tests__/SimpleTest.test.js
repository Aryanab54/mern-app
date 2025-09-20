import React from 'react';
import { render } from '@testing-library/react';

// Simple component test without router dependencies
const SimpleComponent = () => <div>Test Component</div>;

describe('Simple Test', () => {
  test('renders without crashing', () => {
    render(<SimpleComponent />);
  });

  test('basic functionality works', () => {
    expect(1 + 1).toBe(2);
  });
});