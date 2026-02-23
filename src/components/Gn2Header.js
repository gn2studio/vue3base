export default class Gn2Header extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
    }
    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    width: 100%;
                    position: sticky;
                    top: 0;
                    z-index: 100;
                    padding: 1rem 2rem;
                    box-sizing: border-box;
                    background: rgba(25, 25, 30, 0.4);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }
                nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .logo {
                    font-size: 1.5rem;
                    font-weight: 800;
                    color: oklch(95% 0.01 250);
                    text-decoration: none;
                    letter-spacing: -0.05em;
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }
                .logo span {
                    color: oklch(75% 0.15 200); /* Cyan accent */
                }
                .links {
                    display: flex;
                    gap: 1.5rem;
                }
                .links a {
                    color: oklch(80% 0.05 250);
                    text-decoration: none;
                    font-weight: 500;
                    transition: color 0.3s ease, text-shadow 0.3s ease;
                }
                .links a:hover {
                    color: #fff;
                    text-shadow: 0 0 10px oklch(75% 0.15 200 / 0.8);
                }
            </style>
            <nav>
                <a href="/" class="logo">GN2<span>Studio</span></a>
                <div class="links">
                    <a href="#projects">Projects</a>
                    <a href="#services">Services</a>
                    <a href="https://www.gn2studio.com/Customer/Create" target="_blank">Contact</a>
                </div>
            </nav>
        `;
    }
}
customElements.define('gn2-header', Gn2Header);
