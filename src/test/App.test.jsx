import { render, screen } from '@testing-library/react';
import * as React from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

/* ------------------------------------------------------------------ */
/*  Мок framer-motion — без реальных анимаций                         */
/* ------------------------------------------------------------------ */
vi.mock('framer-motion', () => {
  const motion = new Proxy(
    {},
    {
      get: (_target, tag) => {
        const Component = ({ children, ...props }) => {
          const {
            initial, animate, exit, transition, variants,
            whileHover, whileTap, whileInView, layout, layoutId,
            onAnimationComplete, onAnimationStart, ...rest
          } = props;
          return React.createElement(tag, rest, children);
        };
        Component.displayName = `motion.${String(tag)}`;
        return Component;
      },
    }
  );

  return {
    motion,
    AnimatePresence: ({ children }) => children,
  };
});

/* ------------------------------------------------------------------ */
/*  Мок WebSocket — как конструктор                                   */
/* ------------------------------------------------------------------ */
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

  global.matchMedia = vi.fn((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));

  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  vi.doUnmock('../config.js');
});

/* ------------------------------------------------------------------ */
/*  Тесты                                                             */
/* ------------------------------------------------------------------ */
describe('App с заданным DISCORD_USER_ID', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doMock('../config.js', () => ({ DISCORD_USER_ID: '123456789012345678' }));
  });

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