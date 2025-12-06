// ================================
// GENERATIVE HERO ANIMATION (Low Poly)
// ================================

const canvas = document.getElementById('hero-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let triangles = [];

    // Configuration
    // Configuration
    const config = {
        triangleSize: 120,    // Base size of triangles
        speed: 0.0003,        // Animation speed
        colorPalette: [
            '#22C55E', // Accent Green
            '#16A34A', // Forest Green
            '#15803D', // Dark Green
            '#166534', // Deep Forest
            '#14532D', // Very Dark Green
            '#0D3320'  // Almost Black Green
        ]
    };

    // Vertex class represents a point in the grid
    class Vertex {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.originX = x;
            this.originY = y;
            this.vx = (Math.random() - 0.5) * 2; // Random velocity X
            this.vy = (Math.random() - 0.5) * 2; // Random velocity Y
            // Random offset for organic lookup
            this.swayOffset = Math.random() * Math.PI * 2;
        }

        update(time) {
            // Sway motion
            this.x = this.originX + Math.sin(time * config.speed + this.swayOffset) * 20;
            this.y = this.originY + Math.cos(time * config.speed + this.swayOffset) * 20;
        }
    }

    // Triangle class connects 3 vertices
    class Triangle {
        constructor(v1, v2, v3) {
            this.v1 = v1;
            this.v2 = v2;
            this.v3 = v3;
            // Assign random color from palette
            this.color = config.colorPalette[Math.floor(Math.random() * config.colorPalette.length)];
            // Opacity for blending - Full visibility
            this.alpha = 1.0;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.moveTo(this.v1.x, this.v1.y);
            ctx.lineTo(this.v2.x, this.v2.y);
            ctx.lineTo(this.v3.x, this.v3.y);
            ctx.closePath();

            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.alpha;
            ctx.fill();

            // Optional: stroke for wireframe feel
            ctx.strokeStyle = 'rgba(255,255,255,0.05)';
            ctx.stroke();

            ctx.globalAlpha = 1; // Reset alpha
        }
    }

    function init() {
        resize();
        createGrid();
        animate();
    }

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    function createGrid() {
        triangles = [];
        const vertices = [];
        const cols = Math.ceil(width / config.triangleSize) + 2;
        const rows = Math.ceil(height / config.triangleSize) + 2;

        // 1. Create Vertices Grid
        for (let y = -1; y < rows; y++) {
            const rowVertices = [];
            for (let x = -1; x < cols; x++) {
                // Add random jitter to vertex position
                let posX = x * config.triangleSize + (Math.random() - 0.5) * (config.triangleSize * 0.4);
                let posY = y * config.triangleSize + (Math.random() - 0.5) * (config.triangleSize * 0.4);

                // Shift every other row for hexagonal packing
                if (y % 2 !== 0) {
                    posX += config.triangleSize / 2;
                }

                rowVertices.push(new Vertex(posX, posY));
            }
            vertices.push(rowVertices);
        }

        // 2. Create Triangles from Vertices
        for (let y = 0; y < vertices.length - 1; y++) {
            for (let x = 0; x < vertices[y].length - 1; x++) {
                const v1 = vertices[y][x];
                const v2 = vertices[y][x + 1];
                const v3 = vertices[y + 1][x];
                const v4 = vertices[y + 1][x + 1];

                // Split quad into two triangles
                // Randomly flip diagonal for variety
                if (Math.random() > 0.5) {
                    triangles.push(new Triangle(v1, v2, v3));
                    triangles.push(new Triangle(v2, v4, v3));
                } else {
                    triangles.push(new Triangle(v1, v2, v4));
                    triangles.push(new Triangle(v1, v4, v3));
                }
            }
        }
    }

    function animate(time = 0) {
        ctx.clearRect(0, 0, width, height);

        // Draw background
        ctx.fillStyle = '#0a0a0a'; // Deep dark background
        ctx.fillRect(0, 0, width, height);

        // Update vertices
        // We need to access vertices. Since they are referenced in triangles,
        // we can iterate unique vertices? Or better, store distinct vertices list.
        // For simplicity in this lightweight script, we'll update vertices implicitly
        // by iterating a unique set if we stored one, but here we can just update 
        // them as we stored them in the grid creation? 
        // Actually, let's just update all triangles' vertices. 
        // Note: vertices are shared objects, so updating v1 in one triangle updates it in neighbor.
        // To do this efficiently, we should have kept the 'vertices' array global or accessible.
        // Let's rely on the fact that we created triangles with references.

        // Quick hack: recreate valid vertices set optimization not needed for < 500 nodes.
        // We will just iterate the grid used in construction if we kept it.
        // For now, let's re-calculate sway in the draw loop? No, stateful update is better.

        // Let's fix the scope.
        // Actually, we can just iterate triangles and update their vertices.
        // Since vertices are shared, we use a 'visited' flag for this frame?
        // Or simpler: Just animate the sway in the vertex itself based on absolute time.

        triangles.forEach(t => {
            t.v1.update(time);
            t.v2.update(time);
            t.v3.update(time);
            t.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
        resize();
        createGrid();
    });

    init();
}
