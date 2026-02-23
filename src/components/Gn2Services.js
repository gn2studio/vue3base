export default class Gn2Services extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
    }
    render() {
        const services = [
            { title: "메리톡톡", desc: "컨텐츠 기반 커뮤니티 서비스", link: "https://www.merrytoktok.com" },
            { title: "와글커뮤니티", desc: "템플릿기반 커뮤니티 솔루션", link: "https://waggle.gn2studio.com" },
            { title: "준비중", desc: "새로운 서비스를 준비중입니다", link: "https://roslyn.dev" }
        ];

        let cardsHtml = services.map(s => `
            <a href="${s.link}" target="_blank" class="card">
                <div class="icon">🚀</div>
                <h3>${s.title}</h3>
                <p>${s.desc}</p>
                <div class="arrow">→</div>
            </a>
        `).join('');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 2rem 0;
                    width: 100%;
                }
                .section-header {
                    text-align: center;
                    margin-bottom: 3.5rem;
                }
                h2 {
                    font-size: clamp(2rem, 4vw, 3rem);
                    color: #fff;
                    margin: 0 0 1rem 0;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                }
                .subtitle {
                    color: oklch(70% 0.05 250);
                    font-size: 1.15rem;
                    max-width: 600px;
                    margin: 0 auto;
                    line-height: 1.6;
                }
                .grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 1.5rem;
                    width: 100%;
                }
                .card {
                    background: rgba(255, 255, 255, 0.03);
                    backdrop-filter: blur(16px);
                    -webkit-backdrop-filter: blur(16px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px;
                    padding: 3rem 2rem;
                    text-decoration: none;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                    overflow: hidden;
                    display: block;
                }
                .card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .card:hover {
                    transform: translateY(-10px) scale(1.03);
                    border-color: oklch(75% 0.15 200 / 0.5);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 20px oklch(75% 0.15 200 / 0.2);
                }
                .card:hover::before {
                    opacity: 1;
                }
                .icon {
                    font-size: 3rem;
                    margin-bottom: 1.5rem;
                    filter: drop-shadow(0 0 10px rgba(255,255,255,0.2));
                }
                h3 {
                    color: #fff;
                    font-size: 1.5rem;
                    margin: 0 0 0.5rem 0;
                }
                p {
                    color: oklch(75% 0.02 250);
                    margin: 0;
                    font-size: 1rem;
                }
                .arrow {
                    position: absolute;
                    bottom: 2rem;
                    right: 2rem;
                    font-size: 1.5rem;
                    color: oklch(75% 0.15 200);
                    opacity: 0;
                    transform: translateX(-15px);
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .card:hover .arrow {
                    opacity: 1;
                    transform: translateX(0);
                }
            </style>
            <div class="section-header" id="services">
                <h2>주요 서비스</h2>
                <div class="subtitle">다양한 시도와 도전을 통해 끊임없이 기술 개발 및 고객과의 접점을 확대하고 있습니다.</div>
            </div>
            <div class="grid">
                ${cardsHtml}
            </div>
        `;
    }
}
customElements.define('gn2-services', Gn2Services);
