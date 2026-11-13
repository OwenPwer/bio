import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

class MockWebSocket {
  constructor(url) {
    this.url = url;
    this.readyState = 0;
    this.send = vi.fn();
    this.close = vi.fn();
    this.onopen = null;
    this.onmessage = null;
    this.onerror = null;
    this.onclose = null;
  }
}

beforeEach(() => {
  global.WebSocket = MockWebSocket;
  global.WebSocket.OPEN = 1;
  global.WebSocket.CONNECTING = 0;
  global.WebSocket.CLOSING = 2;
  global.WebSocket.CLOSED = 3;

  global.matchMedia = vi.fn(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
});

afterEach(() => {
  vi.resetModules();
  vi.doUnmock('../config.js');
});

describe('App с заданным DISCORD_USER_ID', () => {
  it('renders name and tabs', async () => {
    const { default: App } = await import('../App');
    render(<App />);
    expect(screen.getByText('Owen Yaku Pers')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /links/i })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });
});

describe('App без DISCORD_USER_ID', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock('../config.js', () => ({ DISCORD_USER_ID: '' }));
  });

  it('shows warning when VITE_DISCORD_USER_ID is empty', async () => {
    const { default: App } = await import('../App');
    render(<App />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});