import { useEffect } from 'react';

export function useConstellation(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mouse = { x: null, y: null };

    let particles = [];
    let animationFrameId = null;
    let resizeRafId = null;
    let isAnimating = false;
    let width = 0;
    let height = 0;
    let currentDpr = window.devicePixelRatio || 1;

    class ConstellationParticle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 1.5 + 0.5;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * 0.3 - 0.15;
        this.alpha = Math.random() * 0.25 + 0.1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = `rgba(245, 158, 11, ${this.alpha})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      const isMobile = width < 768;
      const isLowPower = (navigator.hardwareConcurrency || 4) <= 4;
      const divisor = isMobile ? 25000 : 18000;
      const baseMax = isMobile ? 60 : 120;
      const maxParticles = isLowPower ? Math.floor(baseMax / 2) : baseMax;
      const count = Math.min(maxParticles, Math.floor((width * height) / divisor));
      particles = Array.from({ length: count }, () => new ConstellationParticle());
    }

    function drawLines() {
      const maxDistance = 115;
      const maxDistanceSq = maxDistance * maxDistance;
      const mouseMaxDistance = 160;
      const mouseMaxDistanceSq = mouseMaxDistance * mouseMaxDistance;

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistanceSq) {
            const dist = Math.sqrt(distSq);
            const alpha = (1 - dist / maxDistance) * 0.08;
            ctx.strokeStyle = `rgba(245, 158, 11, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const mDx = particles[i].x - mouse.x;
          const mDy = particles[i].y - mouse.y;
          const mDistSq = mDx * mDx + mDy * mDy;

          if (mDistSq < mouseMaxDistanceSq) {
            const mDist = Math.sqrt(mDistSq);
            const mAlpha = (1 - mDist / mouseMaxDistance) * 0.12;
            ctx.strokeStyle = `rgba(245, 158, 11, ${mAlpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }
    }

    function drawScene(shouldUpdate) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        if (shouldUpdate) particles[i].update();
        particles[i].draw();
      }
      drawLines();
    }

    function resizeCanvas() {
      width = window.innerWidth;
      height = window.innerHeight;
      currentDpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * currentDpr;
      canvas.height = height * currentDpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(currentDpr, 0, 0, currentDpr, 0, 0);
      initParticles();

      if (!isAnimating) drawScene(false);
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      drawScene(true);
    }

    function startAnimation() {
      if (reducedMotion || isAnimating) return;
      isAnimating = true;
      animationFrameId = requestAnimationFrame(animate);
    }

    function stopAnimation() {
      isAnimating = false;
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    }

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    const handleMouseOut = (e) => {
      if (!e.relatedTarget) handleMouseLeave();
    };

    const handleResize = () => {
      if (resizeRafId !== null) return;
      resizeRafId = requestAnimationFrame(() => {
        resizeRafId = null;
        resizeCanvas();
      });
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else if (reducedMotion) {
        drawScene(false);
      } else {
        startAnimation();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseout', handleMouseOut);
    window.addEventListener('blur', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    resizeCanvas();
    if (!document.hidden) startAnimation();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('blur', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (resizeRafId !== null) cancelAnimationFrame(resizeRafId);
      stopAnimation();
    };
  }, [canvasRef]);
}