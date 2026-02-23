// Application Entry Point
import './src/components/Gn2Header.js';
import './src/components/Gn2Hero.js';
import './src/components/Gn2Projects.js';
import './src/components/Gn2Services.js';
import { GraphEngine } from './src/core/GraphEngine.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Interactive Background Canvas
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        new GraphEngine(canvas);
    }
});
