let runtimeConfig = {};

const AppConfig = {
  async init() {
    runtimeConfig = await (await import('./loadConfig')).default();
  },
  get(key) {
    return runtimeConfig[key] || null;
  }
};

export default AppConfig;