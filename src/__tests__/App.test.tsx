import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

// Mock ReactFlow
jest.mock('reactflow', () => ({
  ...jest.requireActual('reactflow'),
  useReactFlow: () => ({
    fitView: jest.fn(),
  }),
}));

describe('DAG Editor App', () => {
  beforeEach(() => {
    render(<App />);
  });

  test('renders the main application', () => {
    expect(screen.getByText('Node Tools')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('adds a new node when Add Node button is clicked', async () => {
    const user = userEvent.setup();
    const addButton = screen.getByRole('button', { name: /add node/i });
    
    await user.click(addButton);
    
    // Check if validation banner shows updated node count
    await waitFor(() => {
      expect(screen.getByText(/4 nodes/)).toBeInTheDocument();
    });
  });

  test('shows validation banner with graph status', () => {
    expect(screen.getByText(/Graph Valid/)).toBeInTheDocument();
    expect(screen.getByText(/3 nodes, 2 edges/)).toBeInTheDocument();
  });

  test('undo/redo buttons are initially disabled/enabled correctly', () => {
    const undoButton = screen.getByRole('button', { name: /undo/i });
    const redoButton = screen.getByRole('button', { name: /redo/i });
    
    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();
  });

  test('layout buttons are present and clickable', () => {
    const verticalButton = screen.getByRole('button', { name: /vertical/i });
    const horizontalButton = screen.getByRole('button', { name: /horizontal/i });
    
    expect(verticalButton).toBeInTheDocument();
    expect(horizontalButton).toBeInTheDocument();
    expect(verticalButton).not.toBeDisabled();
    expect(horizontalButton).not.toBeDisabled();
  });

  test('clear all button shows confirmation dialog', async () => {
    const user = userEvent.setup();
    
    // Mock window.confirm
    const confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(false);
    
    const clearButton = screen.getByRole('button', { name: /clear all/i });
    await user.click(clearButton);
    
    expect(confirmSpy).toHaveBeenCalledWith(
      'Are you sure you want to clear the entire graph? This action cannot be undone.'
    );
    
    confirmSpy.mockRestore();
  });

  test('side panel toggle button is present', () => {
    const toggleButton = screen.getByTitle('Open data panel');
    expect(toggleButton).toBeInTheDocument();
  });
});