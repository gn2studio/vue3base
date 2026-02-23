export default class Gn2Hero extends HTMLElement {
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
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                    min-height: 50vh;
                    padding: 2rem;
                }
                h1 {
                    font-size: clamp(3rem, 7vw, 5rem);
                    font-weight: 800;
                    letter-spacing: -0.03em;
                    margin: 0 0 1.5rem 0;
                    background: linear-gradient(135deg, #fff 0%, oklch(70% 0.15 200) 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    line-height: 1.1;
                }
                h2 {
                    font-size: clamp(1.1rem, 2.5vw, 1.5rem);
                    color: oklch(85% 0.02 250);
                    font-weight: 400;
                    max-width: 800px;
                    margin: 0 0 3rem 0;
                    line-height: 1.6;
                }
                .btn {
                    padding: 1.2rem 3rem;
                    border-radius: 40px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.15);
                    color: white;
                    font-size: 1.2rem;
                    font-weight: 700;
                    cursor: pointer;
                    text-decoration: none;
                    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                    backdrop-filter: blur(10px);
                }
                .btn:hover {
                    background: rgba(120, 200, 250, 0.15);
                    border-color: oklch(75% 0.15 200);
                    box-shadow: 0 0 25px oklch(75% 0.15 200 / 0.6);
                    transform: translateY(-3px) scale(1.02);
                }
                .btn:active {
                    transform: translateY(0) scale(0.98);
                }
            </style>
            <h1>AI 기반 IT 솔루션<br/>최고의 파트너</h1>
            <h2>우리는 GPT 기반 AI, Azure/AWS 클라우드 기술을 접목한 맞춤형 솔루션을 제작합니다. 기획부터 디자인, 개발, 운영까지 One-Stop으로 제공합니다.</h2>
            <a href="https://www.gn2studio.com/Customer/Create" target="_blank" class="btn">프로젝트 제작 문의하기</a>
        `;
    }
}
customElements.define('gn2-hero', Gn2Hero);
