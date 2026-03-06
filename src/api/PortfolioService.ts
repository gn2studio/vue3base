export interface PortfolioItem {
    id: number;
    title: string;
    desc: string;
    client: string;
    year: number;
    tags: string[];
}

export class PortfolioService {
    static endpoints = {
        GET_PORTFOLIO_LIST: '/portfolios',
        GET_PORTFOLIO_DETAIL: '/portfolios/{id}'
    };

    /**
     * @description 주요 포트폴리오 목록을 가져오는 가상 함수
     * @todo 백엔드 Swagger 연동 시: GET /portfolios 엔드포인트 연결 필요
     * @returns {Promise<PortfolioItem[]>} 
     */
    static async getPortfolios(params?: any): Promise<PortfolioItem[]> {
        console.log('API Request Params:', params);

        // 비동기 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 500));

        // 임의의 Mock 데이터 반환
        return [
            { id: 1, title: '삼성반도체 권한관리 솔루션', desc: '생산라인 접근 권한 제어 및 관리 솔루션 개발 및 유지보수', client: '삼성전자', year: 2025, tags: ['Web', 'Security'] },
            { id: 2, title: 'SGC에너지 모니터링', desc: 'SGC에너지 열병합발전소 모니터링 솔루션 개발 및 유지보수', client: 'SGC에너지', year: 2024, tags: ['Monitoring', 'IoT'] },
            { id: 3, title: '인천대학교 국가과제', desc: '인천대학교 삼성전자 테스터기 원격제어 과제 참여', client: '인천대학교', year: 2024, tags: ['Hardware Control', 'RnD'] },
            { id: 4, title: '미래선도과제', desc: '미래부 국가과제 미래선도과제(소상공인네트워크) 참여', client: '미래창조과학부', year: 2023, tags: ['Network', 'Gov'] },
            { id: 5, title: '스마트팩토리 보급사업', desc: '스마트팩토리 보급사업 및 컨설팅, 현장관리 및 솔루션 제안', client: '중소벤처기업부', year: 2023, tags: ['Smart Factory', 'Consulting'] },
            { id: 6, title: '헬스케어 솔루션', desc: '운동 및 식단관리 솔루션 개발', client: '내부 프로젝트', year: 2025, tags: ['Healthcare', 'Mobile App'] }
        ];
    }

    /**
     * @description 주요 포트폴리오 상세 정보를 가져오는 가상 함수
     * @todo 백엔드 Swagger 연동 시: GET /portfolios/{id} 엔드포인트 연결 필요
     * @returns {Promise<PortfolioItem | null>} 
     */
    static async getPortfolioDetail(id: number): Promise<PortfolioItem | null> {
        console.log(`API Request Detail ID: ${id}`);
        await new Promise(resolve => setTimeout(resolve, 400));

        const portfolios = await this.getPortfolios();
        return portfolios.find(p => p.id === id) || null;
    }
}
