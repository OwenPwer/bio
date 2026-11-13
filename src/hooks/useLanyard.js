import { useEffect, useState, useRef } from 'react';

export function useLanyard(userId) {
  const [presence, setPresence] = useState(null);
  const [error, setError] = useState(false);

  const wsRef = useRef(null);
  const reconnectAttempt = useRef(0);
  const reconnectTimer = useRef(null);

  useEffect(() => {
    if (!userId) return;

    reconnectAttempt.current = 0;

    let heartbeatInterval = null;
    let cancelled = false;

    const connect = () => {
      if (cancelled) return;

      const socket = new WebSocket('wss://api.lanyard.rest/socket');
      wsRef.current = socket;

      socket.onopen = () => {
        reconnectAttempt.current = 0;
      };

      socket.onmessage = (event) => {
        let msg;
        try {
          msg = JSON.parse(event.data);
        } catch (err) {
          console.warn('Lanyard: failed to parse message', err);
          return;
        }

        const { op, t, d } = msg;

        if (op === 1) {
          clearInterval(heartbeatInterval);
          heartbeatInterval = setInterval(() => {
            if (socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ op: 3 }));
            }
          }, d.heartbeat_interval);

          socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: userId } }));
        }

        if (op === 0 && (t === 'INIT_STATE' || t === 'PRESENCE_UPDATE')) {
          setPresence(d);
          setError(false);
        }
      };

      socket.onerror = () => {
        if (!cancelled) setError(true);
        socket.close();
      };

      socket.onclose = () => {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
        if (cancelled) return;

        const delay = Math.min(30_000, 1_000 * 2 ** reconnectAttempt.current);
        reconnectAttempt.current += 1;
        reconnectTimer.current = setTimeout(connect, delay);
      };
    };

    connect();

    return () => {
      cancelled = true;
      clearTimeout(reconnectTimer.current);
      clearInterval(heartbeatInterval);

      const socket = wsRef.current;
      if (socket) {
        socket.onopen = null;
        socket.onmessage = null;
        socket.onerror = null;
        socket.onclose = null;
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING) {
          socket.close();
        }
        wsRef.current = null;
      }
    };
  }, [userId]);

  return { presence, error };
}