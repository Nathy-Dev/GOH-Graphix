(function () {
    // Animated gradient background for hero
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    // Respect reduced motion
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let w = 0, h = 0, raf;

    const blobs = [
        { x: 0.2, y: 0.2, r: 0.6, color: 'rgba(0,87,183,0.45)', speed: 0.0008 },
        { x: 0.85, y: 0.25, r: 0.45, color: 'rgba(255,107,53,0.35)', speed: 0.0012 },
        { x: 0.6, y: 0.7, r: 0.6, color: 'rgba(0,200,255,0.12)', speed: 0.0006 }
    ];

    function resize() {
        const dpr = window.devicePixelRatio || 1;
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = Math.max(1, Math.floor(w * dpr));
        canvas.height = Math.max(1, Math.floor(h * dpr));
        ctx.scale(dpr, dpr);
    }

    function draw(time) {
        ctx.clearRect(0, 0, w, h);

        blobs.forEach((b, i) => {
            const nx = (b.x + Math.sin(time * b.speed + i) * 0.02) * w;
            const ny = (b.y + Math.cos(time * b.speed * 1.1 + i) * 0.02) * h;
            const radius = Math.min(w, h) * b.r;

            const g = ctx.createRadialGradient(nx, ny, radius * 0.1, nx, ny, radius);
            g.addColorStop(0, b.color);
            g.addColorStop(1, 'rgba(0,0,0,0)');

            ctx.globalCompositeOperation = 'lighter';
            ctx.fillStyle = g;
            ctx.beginPath();
            ctx.arc(nx, ny, radius, 0, Math.PI * 2);
            ctx.fill();
        });

        // soft overlay to tint with primary color
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(2,6,23,0.25)';
        ctx.fillRect(0, 0, w, h);

        raf = requestAnimationFrame(draw);
    }

    function start() {
        cancelAnimationFrame(raf);
        resize();
        raf = requestAnimationFrame(draw);
    }

    window.addEventListener('resize', () => {
        // throttle
        clearTimeout(window._heroCanvasResize);
        window._heroCanvasResize = setTimeout(() => resize(), 120);
    });

    // initialize size after fonts/layout
    requestAnimationFrame(() => start());
})();
