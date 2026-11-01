import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../src/components/ui/Button';
import { CurrencyChip } from '../src/components/ui/CurrencyChip';
import { Toggle } from '../src/components/ui/Toggle';
import { ThemeProvider, useTheme } from '../src/services/themeContext';
import { AuthProvider } from '../src/services/authContext';
import { ToastProvider } from '../src/components/ui/Toast';
import { AuthScreen } from '../src/screens/AuthScreen';

// Helper component to test ThemeProvider interaction
const ThemeTestConsumer: React.FC = () => {
  const { theme, setTheme, isDark } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <span data-testid="is-dark">{isDark ? 'dark' : 'light'}</span>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
    </div>
  );
};

describe('Component & UI Tests', () => {
  it('renders Button with min-height 48px and handles click', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="primary" size="md" onClick={handleClick}>
        Test Glam Button
      </Button>
    );

    const btn = screen.getByRole('button', { name: /Test Glam Button/i });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain('min-h-[48px]');

    fireEvent.click(btn);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders CurrencyChip with balance formatted', () => {
    const handleAdd = vi.fn();
    render(<CurrencyChip type="gems" amount={1250} onAddClick={handleAdd} />);

    expect(screen.getByText('1,250')).toBeInTheDocument();
    const addBtn = screen.getByRole('button', { name: /Buy more gems/i });
    fireEvent.click(addBtn);
    expect(handleAdd).toHaveBeenCalledTimes(1);
  });

  it('toggles switch state and triggers onChange', () => {
    const handleChange = vi.fn();
    render(<Toggle checked={false} onChange={handleChange} label="Sound Effects" />);

    const toggleEl = screen.getByRole('switch', { name: /Sound Effects/i });
    expect(toggleEl).toBeInTheDocument();
    expect(toggleEl.getAttribute('aria-checked')).toBe('false');

    fireEvent.click(toggleEl);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('theme context updates document class and persists choice', () => {
    render(
      <ThemeProvider>
        <ThemeTestConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('current-theme')).toBeInTheDocument();

    const darkBtn = screen.getByText('Set Dark');
    fireEvent.click(darkBtn);

    expect(screen.getByTestId('current-theme').textContent).toBe('dark');
    expect(localStorage.getItem('glam_blocks_theme')).toBe('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);

    const lightBtn = screen.getByText('Set Light');
    fireEvent.click(lightBtn);

    expect(screen.getByTestId('current-theme').textContent).toBe('light');
    expect(localStorage.getItem('glam_blocks_theme')).toBe('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('requires Terms & Privacy consent before completing authentication', async () => {
    const handleSuccess = vi.fn();
    render(
      <AuthProvider>
        <ToastProvider>
          <AuthScreen
            onSuccess={handleSuccess}
            onOpenPrivacy={() => {}}
            onOpenTerms={() => {}}
          />
        </ToastProvider>
      </AuthProvider>
    );

    // Try Google sign in without ticking terms checkbox
    const googleBtn = screen.getByRole('button', { name: /Continue with Google/i });
    fireEvent.click(googleBtn);

    // Should not succeed
    expect(handleSuccess).not.toHaveBeenCalled();
    expect(
      screen.getByText(/Please accept the Terms of Service & Privacy Policy to continue/i)
    ).toBeInTheDocument();
  });
});
