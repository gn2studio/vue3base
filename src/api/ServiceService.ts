export interface ServiceItem {
    id: number;
    title: string;
    desc: string;
    link: string;
    thumbnailUrl?: string;
    createdAt: string;
}

export class ServiceService {
    static endpoints = {
        GET_SERVICE_LIST: '/services',
        GET_SERVICE_DETAIL: '/services/{id}'
    };

    /**
     * @description 주요 서비스 목록을 가져오는 가상 함수
     * @todo 백엔드 Swagger 연동 시: GET /services 엔드포인트 연결 필요
     * @returns {Promise<ServiceItem[]>} 
     */
    static async getServices(params?: any): Promise<ServiceItem[]> {
        console.log('API Request Params:', params);

        // 비동기 시뮬레이션
        await new Promise(resolve => setTimeout(resolve, 600));

        // 임의의 Mock 데이터 반환
        return [
            { id: 1, title: '메리톡톡', desc: '컨텐츠 기반 커뮤니티 서비스', link: 'https://www.merrytoktok.com', createdAt: '2026-01-01' },
            { id: 2, title: '와글커뮤니티', desc: '템플릿기반 커뮤니티 솔루션', link: 'https://waggle.gn2studio.com', createdAt: '2026-02-15' },
            { id: 3, title: '준비중', desc: '새로운 서비스를 준비중입니다', link: 'https://roslyn.dev', createdAt: '2026-03-01' }
        ];
    }

    /**
     * @description 주요 서비스 상세 정보를 가져오는 가상 함수
     * @todo 백엔드 Swagger 연동 시: GET /services/{id} 엔드포인트 연결 필요
     * @returns {Promise<ServiceItem | null>} 
     */
    static async getServiceDetail(id: number): Promise<ServiceItem | null> {
        console.log(`API Request Detail ID: ${id}`);
        await new Promise(resolve => setTimeout(resolve, 400));

        const services = await this.getServices();
        return services.find(s => s.id === id) || null;
    }
}
