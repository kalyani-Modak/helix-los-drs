/** Map all Vite-exposed VITE_* vars into runtime config keys (strip VITE_ prefix). */
const configFromViteEnv = () => {
  const config = {};
  for (const [key, value] of Object.entries(import.meta.env)) {
    if (!key.startsWith("VITE_")) continue;
    config[key.slice("VITE_".length)] =
      typeof value === "string" ? value.trim() : value;
  }
  return config;
};

const loadConfig = async () => {
  if (import.meta.env.DEV) {
    console.info("✅ Using Vite env vars in dev mode");
    return configFromViteEnv();
  }

  // In production, fetch from config.json
  try {
    const response = await fetch('/drs/config.json');
    if (!response.ok) throw new Error("Failed to load config.json");
    const config = await response.json();
    console.info("✅ Runtime config loaded:", config);
    return config;
  } catch (error) {
    console.error("❌ Runtime config load failed:", error);
    return {}; // fallback to empty config
  }
};

export default loadConfig;