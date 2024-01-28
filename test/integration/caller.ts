import Routes from '../../src/api/routes/instance';

const internalAppCaller = Routes.instance().createTestInternalCaller();

const externalAppCaller = Routes.instance().external();

export { internalAppCaller, externalAppCaller };
