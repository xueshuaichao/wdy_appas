
import {isDev,isTest,testNum} from "@/const/env";

let Host;
switch (true) {
    case isDev:
    case isTest:
        Host = {
            TEST: 'http://192.168.9.13:8888',
            APAAS: `http://apaas-service.testing${testNum}.wdeduc.com`,
            OSS: 'http://cdn-apaas.wdcloudnet.com',
            ALI_VIDEO: 'http://test-platform-vod.wdecloud.com'
        };
        break;
    default:
        Host = {
            TEST: 'http://192.168.9.13:8888',
            APAAS: 'http://apaas-service.testing1.wdeduc.com',
            OSS: 'http://cdn-apaas.wdcloudnet.com',
            ALI_VIDEO: 'http://test-platform-vod.wdecloud.com'
        };
}

export default Host;
