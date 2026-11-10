import { useRef } from 'react';
import { useConstellation } from '../hooks/useConstellation';

export function ConstellationCanvas() {
  const canvasRef = useRef(null);
  
  // Передаем ref в наш кастомный хук с логикой рендеринга
  useConstellation(canvasRef);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}