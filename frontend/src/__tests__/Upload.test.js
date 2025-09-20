import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Upload from '../pages/Upload';

const UploadWrapper = ({ children }) => (
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

describe('Upload Component', () => {
  test('renders upload interface', () => {
    render(
      <UploadWrapper>
        <Upload />
      </UploadWrapper>
    );

    expect(screen.getByText('Upload & Distribute')).toBeInTheDocument();
    expect(screen.getByText('Drop your file here')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /browse files/i })).toBeInTheDocument();
    expect(screen.getByText('File Requirements')).toBeInTheDocument();
    expect(screen.getByText('Distribution Logic')).toBeInTheDocument();
  });

  test('validates file type', async () => {
    const user = userEvent.setup();
    render(
      <UploadWrapper>
        <Upload />
      </UploadWrapper>
    );

    const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
    const fileInput = screen.getByRole('button', { name: /browse files/i });
    
    // Simulate file selection
    const hiddenInput = document.querySelector('input[type="file"]');
    await user.upload(hiddenInput, file);

    await waitFor(() => {
      expect(screen.getByText(/please select a valid csv, xls, or xlsx file/i)).toBeInTheDocument();
    });
  });

  test('accepts valid file types', async () => {
    const user = userEvent.setup();
    render(
      <UploadWrapper>
        <Upload />
      </UploadWrapper>
    );

    const file = new File(['name,phone,notes\\nJohn,1234567890,Test'], 'test.csv', { type: 'text/csv' });
    const hiddenInput = document.querySelector('input[type="file"]');
    
    await user.upload(hiddenInput, file);

    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
      expect(screen.getByText(/KB/)).toBeInTheDocument();
    });
  });

  test('shows error when no file selected for upload', async () => {
    const user = userEvent.setup();
    render(
      <UploadWrapper>
        <Upload />
      </UploadWrapper>
    );

    const uploadButton = screen.getByRole('button', { name: /upload and distribute/i });
    await user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText('Please select a file to upload')).toBeInTheDocument();
    });
  });

  test('uploads file successfully', async () => {
    const user = userEvent.setup();
    render(
      <UploadWrapper>
        <Upload />
      </UploadWrapper>
    );

    const file = new File(['name,phone,notes\\nJohn,1234567890,Test'], 'test.csv', { type: 'text/csv' });
    const hiddenInput = document.querySelector('input[type="file"]');
    
    await user.upload(hiddenInput, file);
    
    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });

    const uploadButton = screen.getByRole('button', { name: /upload and distribute/i });
    await user.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText('Processing...')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText(/file uploaded successfully/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('removes selected file', async () => {
    const user = userEvent.setup();
    render(
      <UploadWrapper>
        <Upload />
      </UploadWrapper>
    );

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const hiddenInput = document.querySelector('input[type="file"]');
    
    await user.upload(hiddenInput, file);
    
    await waitFor(() => {
      expect(screen.getByText('test.csv')).toBeInTheDocument();
    });

    const removeButton = screen.getByRole('button', { name: '' }); // X button
    await user.click(removeButton);

    await waitFor(() => {
      expect(screen.queryByText('test.csv')).not.toBeInTheDocument();
    });
  });
});