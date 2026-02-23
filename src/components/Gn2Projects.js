export default class Gn2Projects extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render();
    }
    render() {
        const projects = [
            { title: "삼성반도체 권한관리 솔루션", desc: "생산라인 접근 권한 제어 및 관리 솔루션 개발 및 유지보수" },
            { title: "SGC에너지 모니터링", desc: "SGC에너지 열병합발전소 모니터링 솔루션 개발 및 유지보수" },
            { title: "인천대학교 국가과제", desc: "인천대학교 삼성전자 테스터기 원격제어 과제 참여" },
            { title: "미래선도과제", desc: "미래부 국가과제 미래선도과제(소상공인네트워크) 참여" },
            { title: "스마트팩토리 보급사업", desc: "스마트팩토리 보급사업 및 컨설팅, 현장관리 및 솔루션 제안" },
            { title: "헬스케어 솔루션", desc: "운동 및 식단관리 솔루션 개발" }
        ];

        let cardsHtml = projects.map(p => `
            <div class="card">
                <h3>${p.title}</h3>
                <p>${p.desc}</p>
            </div>
        `).join('');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 4rem 0 2rem 0;
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
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 1.5rem;
                    width: 100%;
                }
                .card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(12px);
                    -webkit-backdrop-filter: blur(12px);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    padding: 2.5rem 2rem;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .card:hover {
                    background: rgba(255, 255, 255, 0.06);
                    border-color: rgba(255, 255, 255, 0.15);
                    transform: translateY(-8px);
                    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
                }
                h3 {
                    color: oklch(90% 0.05 200);
                    font-size: 1.35rem;
                    margin: 0 0 1rem 0;
                    font-weight: 700;
                }
                p {
                    color: oklch(75% 0.02 250);
                    line-height: 1.6;
                    margin: 0;
                    font-size: 0.95rem;
                }
            </style>
            <div class="section-header" id="projects">
                <h2>주요 프로젝트</h2>
                <div class="subtitle">내부 솔루션 커스터마이징과 클라우드 연계로, 단순한 홈페이지 이상의 가치를 제공합니다.</div>
            </div>
            <div class="grid">
                ${cardsHtml}
            </div>
        `;
    }
}
customElements.define('gn2-projects', Gn2Projects);
