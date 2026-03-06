/**
 * Silent Renew iframe 전용 진입점
 * Vite가 이 파일을 독립 번들로 처리합니다.
 */
import { UserManager, WebStorageStateStore } from 'oidc-client-ts';

const localStore = new WebStorageStateStore({ store: window.localStorage });

// authority/client_id 없이 stateStore만 맞추면 signinSilentCallback 동작
const mgr = new UserManager({
    authority: '',
    client_id: '',
    redirect_uri: '',
    userStore: localStore,
    stateStore: localStore,
});

const initializeCallback = async () => {
    try {
        await mgr.signinSilentCallback();
    } catch (e) {
        console.error('[silent-renew] callback 처리 실패:', e);
    }
};

initializeCallback();
