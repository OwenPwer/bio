import { useState, useEffect } from 'react';

export function useLanyard(userId) {
  const [presence, setPresence] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) return;

    let heartbeatInterval = null;
    let cancelled = false;
    let socket = null;

    const timeoutId = setTimeout(() => {
      if (cancelled) return;

      socket = new WebSocket('wss://api.lanyard.rest/socket');

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

      socket.onerror = (err) => {
        console.error('Lanyard WebSocket Error:', err);
        if (!cancelled) setError(true);
      };

      socket.onclose = () => {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
      };
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timeoutId); 
      clearInterval(heartbeatInterval);
      heartbeatInterval = null;

      if (socket) {
        if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CLOSING) {
          socket.close();
        }
        socket = null;
      }
    };
  }, [userId]);

  return { presence, error };
}