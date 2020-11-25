const _host = window.location.host;

const isDev = /dev/.test(_host);
const isTest = /test/.test(_host);
const testNum = isTest? _host.match(/\.testing(\d)\./)[1] : '1';

export {
    isDev,
    isTest,
    testNum
}
