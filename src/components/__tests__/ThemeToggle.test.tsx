import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from 'next-themes';

describe('ThemeToggle Component', () => {
  it('renders the toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button', { name: 'Toggle theme' })).toBeInTheDocument();
  });

  it('toggles theme when clicked', () => {
    const setThemeMock = vi.fn();
    (useTheme as any).mockReturnValue({
      theme: 'light',
      setTheme: setThemeMock,
    });

    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    
    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith('dark');
  });

  it('toggles theme back to light when currently dark', () => {
    const setThemeMock = vi.fn();
    (useTheme as any).mockReturnValue({
      theme: 'dark',
      setTheme: setThemeMock,
    });

    render(<ThemeToggle />);
    const button = screen.getByRole('button', { name: 'Toggle theme' });
    
    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
