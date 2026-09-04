const loadConfig = async () => {
  try {
    const response = await fetch("/drs/config.json");
    if (!response.ok) throw new Error("Failed to load config.json");
    const config = await response.json();
    console.info("✅ Runtime config loaded:", config);
    return config;
  } catch (error) {
    console.error("❌ Runtime config load failed:", error);
    return {};
  }
};
export {
  loadConfig as default
};
