import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from '../Hero';

describe('Hero Component', () => {
  it('renders the hero section with correct text', () => {
    render(<Hero />);
    
    expect(screen.getByText('Amir Shrestha')).toBeInTheDocument();
    expect(screen.getByText(/React-first Full Stack Developer/i)).toBeInTheDocument();
  });

  it('renders CTA buttons with correct links', () => {
    render(<Hero />);
    
    const quoteButton = screen.getByText('Request a Quote');
    expect(quoteButton.closest('a')).toHaveAttribute('href', '#contact');

    const workButton = screen.getByText('View Work');
    expect(workButton.closest('a')).toHaveAttribute('href', '#work');
  });
});
