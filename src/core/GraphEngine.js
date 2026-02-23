/**
 * GraphEngine: Renders an interactive, force-directed "Anti-Gravity" particle network.
 * Employs HTML5 Canvas API and custom vector math for maximum performance.
 */
export class GraphEngine {
    #canvas;
    #ctx;
    #particles = [];
    #connections = [];
    #mouse = { x: -1000, y: -1000, radius: 150 };
    #animationFrameId;
    #config = {
        particleCount: 80,
        maxVelocity: 0.5,
        connectionDistance: 120,
        mouseRepelForce: 0.05
    };

    constructor(canvasElement) {
        this.#canvas = canvasElement;
        this.#ctx = this.#canvas.getContext('2d');

        this.#init();
        this.#bindEvents();
        this.#loop();
    }

    #init() {
        this.#resize();
        this.#particles = [];

        // Distribute particles across screen
        for (let i = 0; i < this.#config.particleCount; i++) {
            this.#particles.push({
                x: Math.random() * this.#canvas.width,
                y: Math.random() * this.#canvas.height,
                vx: (Math.random() - 0.5) * this.#config.maxVelocity * 2,
                vy: (Math.random() - 0.5) * this.#config.maxVelocity * 2,
                radius: Math.random() * 2 + 1,
                mass: Math.random() * 5 + 1
            });
        }
    }

    #resize() {
        // High DPI Display support
        const dpr = window.devicePixelRatio || 1;
        this.#canvas.width = window.innerWidth * dpr;
        this.#canvas.height = window.innerHeight * dpr;

        // Normalize coordinates
        this.#ctx.scale(dpr, dpr);

        // Adjust CSS size
        this.#canvas.style.width = `${window.innerWidth}px`;
        this.#canvas.style.height = `${window.innerHeight}px`;
    }

    #bindEvents() {
        window.addEventListener('resize', () => {
            this.#resize();
            this.#init(); // Reinitialize positions on resize
        });

        window.addEventListener('mousemove', (e) => {
            this.#mouse.x = e.clientX;
            this.#mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            this.#mouse.x = -1000;
            this.#mouse.y = -1000;
        });
    }

    #update() {
        for (let i = 0; i < this.#particles.length; i++) {
            let p = this.#particles[i];

            // Update position
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges smoothly
            if (p.x < 0 || p.x > window.innerWidth) p.vx *= -1;
            if (p.y < 0 || p.y > window.innerHeight) p.vy *= -1;

            // Constrain within bounds just in case
            p.x = Math.max(0, Math.min(window.innerWidth, p.x));
            p.y = Math.max(0, Math.min(window.innerHeight, p.y));

            // Mouse Repulsion (Anti-Gravity effect)
            let dx = this.#mouse.x - p.x;
            let dy = this.#mouse.y - p.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.#mouse.radius) {
                let forceDirectionX = dx / distance;
                let forceDirectionY = dy / distance;

                // Max force at center, 0 at edge of radius
                let force = (this.#mouse.radius - distance) / this.#mouse.radius;

                let directionX = forceDirectionX * force * this.#config.mouseRepelForce;
                let directionY = forceDirectionY * force * this.#config.mouseRepelForce;

                // Repel by subtracting vector
                p.vx -= directionX;
                p.vy -= directionY;
            }

            // Apply slight friction to gradually return to maxVelocity
            const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
            if (speed > this.#config.maxVelocity) {
                p.vx *= 0.98;
                p.vy *= 0.98;
            }
        }
    }

    #draw() {
        this.#ctx.clearRect(0, 0, this.#canvas.width, this.#canvas.height);

        // Draw Connections
        this.#ctx.lineWidth = 1;
        for (let i = 0; i < this.#particles.length; i++) {
            for (let j = i + 1; j < this.#particles.length; j++) {
                let p1 = this.#particles[i];
                let p2 = this.#particles[j];

                let dx = p1.x - p2.x;
                let dy = p1.y - p2.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < this.#config.connectionDistance) {
                    let opacity = 1 - (distance / this.#config.connectionDistance);
                    // Light cyan/blue tinted lines
                    this.#ctx.strokeStyle = `rgba(120, 200, 250, ${opacity * 0.4})`;
                    this.#ctx.beginPath();
                    this.#ctx.moveTo(p1.x, p1.y);
                    this.#ctx.lineTo(p2.x, p2.y);
                    this.#ctx.stroke();
                }
            }
        }

        // Draw Particles
        for (let i = 0; i < this.#particles.length; i++) {
            let p = this.#particles[i];
            this.#ctx.beginPath();
            this.#ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.#ctx.fillStyle = `rgba(255, 255, 255, 0.6)`;
            this.#ctx.fill();
        }
    }

    #loop() {
        this.#update();
        this.#draw();
        this.#animationFrameId = requestAnimationFrame(this.#loop.bind(this));
    }

    destroy() {
        if (this.#animationFrameId) {
            cancelAnimationFrame(this.#animationFrameId);
        }
    }
}
