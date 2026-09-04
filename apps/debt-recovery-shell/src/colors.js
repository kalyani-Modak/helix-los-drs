/* Palette aligned with Interface Delight (HSL tokens → hex): primary blue, soft gray surfaces, slate text */
export const colorPalettes = {
  ADCB: {
    primary: "#2563eb",
    secondary: "#64748b",
    accent: "#ef4444",

    primaryLight: "#3b82f6",
    primaryDark: "#1d4ed8",

    secondaryLight: "#94a3b8",
    secondaryDark: "#475569",

    accentLight: "#f87171",
    accentDark: "#dc2626",

    background: {
      start: "#f4f8fd",
      end: "#eaf1fb",
      gradient: "linear-gradient(180deg, #f4f8fd 0%, #edf4fb 52%, #eaf1fb 100%)",
    },

    gradients: {
      primary: "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
      primaryHover: "linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%)",
      accent: "linear-gradient(90deg, #ef4444 0%, #f87171 100%)",
      accentHover: "linear-gradient(90deg, #dc2626 0%, #ef4444 100%)",
      header: "linear-gradient(90deg, #2563eb 0%, #1d4ed8 50%, #2563eb 100%)",
      card: "linear-gradient(180deg, rgba(255,255,255,0.99) 0%, rgba(244,248,253,0.98) 100%)",
      page:
        "radial-gradient(circle at 0% 0%, rgba(37,99,235,0.08), transparent 30%), radial-gradient(circle at 100% 0%, rgba(96,165,250,0.06), transparent 26%), linear-gradient(180deg, #f4f8fd 0%, #edf4fb 52%, #eaf1fb 100%)",
    },

    cardBg: "#ffffff",

    text: {
      primary: "#141923",
      secondary: "#64748b",
      light: "#94a3b8",
      white: "#ffffff",
    },

    border: "#e2e8f0",
    mutedBg: "hsl(215, 20%, 95%)",
    appBarGradient: "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
    hover: "rgba(37, 99, 235, 0.06)",

    bucketColors: [
    { bg: "#eff6ff", border: "#bfdbfe", text: "#2563eb" }, // 0 - lightest
    { bg: "#dbeafe", border: "#93c5fd", text: "#2563eb" }, // 1
    { bg: "#bfdbfe", border: "#60a5fa", text: "#1d4ed8" }, // 2
    { bg: "#93c5fd", border: "#3b82f6", text: "#1d4ed8" }, // 3
    { bg: "#60a5fa", border: "#2563eb", text: "#1e40af" }, // 4
    { bg: "#3b82f6", border: "#1d4ed8", text: "#ffffff" }, // 5
    { bg: "#2563eb", border: "#1e40af", text: "#ffffff" }, // 6+
  ],
  },

  "AL-HILAL": {
    primary: "#2563eb",
    secondary: "#64748b",
    accent: "#f59e0b",

    primaryLight: "#3b82f6",
    primaryDark: "#1d4ed8",

    secondaryLight: "#94a3b8",
    secondaryDark: "#475569",

    accentLight: "#fbbf24",
    accentDark: "#d97706",

    background: {
      start: "#f4f6f9",
      end: "#eef1f6",
      gradient: "linear-gradient(145deg, hsl(210, 20%, 98%) 0%, hsl(215, 20%, 96%) 100%)",
    },

    gradients: {
      primary: "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
      primaryHover: "linear-gradient(90deg, #1d4ed8 0%, #1e40af 100%)",
      accent: "linear-gradient(90deg, #f59e0b 0%, #fbbf24 100%)",
      accentHover: "linear-gradient(90deg, #d97706 0%, #f59e0b 100%)",
      header: "linear-gradient(90deg, #2563eb 0%, #1d4ed8 50%, #2563eb 100%)",
      card: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(37,99,235,0.04))",
      page:
        "radial-gradient(circle at 0% 0%, rgba(37,99,235,0.08), transparent 45%), radial-gradient(circle at 100% 0%, rgba(245,158,11,0.06), transparent 45%), linear-gradient(145deg, hsl(210, 20%, 98%) 0%, hsl(215, 20%, 96%) 100%)",
    },

    cardBg: "#ffffff",

    text: {
      primary: "#141923",
      secondary: "#64748b",
      light: "#94a3b8",
      white: "#ffffff",
    },

    border: "#e2e8f0",
    mutedBg: "hsl(215, 20%, 95%)",
    appBarGradient: "linear-gradient(90deg, #2563eb 0%, #1d4ed8 100%)",
    hover: "rgba(37, 99, 235, 0.06)",

    bucketColors: [
    { bg: "#fffbeb", border: "#fde68a", text: "#d97706" }, // 0 - lightest
    { bg: "#fef3c7", border: "#fcd34d", text: "#d97706" }, // 1
    { bg: "#fde68a", border: "#fbbf24", text: "#b45309" }, // 2
    { bg: "#fcd34d", border: "#f59e0b", text: "#b45309" }, // 3
    { bg: "#fbbf24", border: "#d97706", text: "#92400e" }, // 4
    { bg: "#f59e0b", border: "#b45309", text: "#ffffff" }, // 5
    { bg: "#d97706", border: "#92400e", text: "#ffffff" }, // 6+
  ],
  },

  "pastel-rose": {
    primary: "#E11D48",
    secondary: "#1C1917",
    accent: "#f43f5e",

    primaryLight: "#fb7185",
    primaryDark: "#be123c",

    secondaryLight: "#78716c",
    secondaryDark: "#0c0a09",

    accentLight: "#fb7185",
    accentDark: "#e11d48",

    background: {
      start: "#fff1f2",
      end: "#ffe4e6",
      gradient: "linear-gradient(145deg, #fff1f2 0%, #ffe4e6 100%)",
    },

    gradients: {
      primary: "linear-gradient(90deg, #E11D48 0%, #be123c 100%)",
      primaryHover: "linear-gradient(90deg, #be123c 0%, #9f1239 100%)",
      header: "linear-gradient(90deg, #E11D48 0%, #be123c 50%, #E11D48 100%)",
      card: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(225,29,72,0.04))",
    },

    cardBg: "#ffffff",

    text: {
      primary: "#1C1917",
      secondary: "#57534e",
      light: "#a8a29e",
      white: "#ffffff",
    },

    border: "#f87171",
    mutedBg: "#fff1f2",
    appBarGradient: "linear-gradient(90deg, #E11D48 0%, #be123c 100%)",
    hover: "rgba(225, 29, 72, 0.08)",

    bucketColors: [
    { bg: "#fff1f2", border: "#fecdd3", text: "#e11d48" }, // 0 - lightest
    { bg: "#ffe4e6", border: "#fda4af", text: "#e11d48" }, // 1
    { bg: "#fecdd3", border: "#fb7185", text: "#be123c" }, // 2
    { bg: "#fda4af", border: "#f43f5e", text: "#be123c" }, // 3
    { bg: "#fb7185", border: "#e11d48", text: "#9f1239" }, // 4
    { bg: "#f43f5e", border: "#be123c", text: "#ffffff" }, // 5
    { bg: "#e11d48", border: "#9f1239", text: "#ffffff" }, // 6+
  ],
  },

  "sage-professional": {
    primary: "#059669",
    secondary: "#1b2e1b",
    accent: "#10b981",

    primaryLight: "#34d399",
    primaryDark: "#047857",

    secondaryLight: "#4b5563",
    secondaryDark: "#111827",

    accentLight: "#34d399",
    accentDark: "#059669",

    background: {
      start: "#f0fdf4",
      end: "#dcfce7",
      gradient: "linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)",
    },

    gradients: {
      primary: "linear-gradient(90deg, #059669 0%, #047857 100%)",
      primaryHover: "linear-gradient(90deg, #047857 0%, #065f46 100%)",
      header: "linear-gradient(90deg, #059669 0%, #047857 50%, #059669 100%)",
      card: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(5,150,105,0.04))",
    },

    cardBg: "#ffffff",

    text: {
      primary: "#111827",
      secondary: "#374151",
      light: "#9ca3af",
      white: "#ffffff",
    },

    border: "#86efac",
    mutedBg: "#f0fdf4",
    appBarGradient: "linear-gradient(90deg, #059669 0%, #047857 100%)",
    hover: "rgba(5, 150, 105, 0.08)",

    bucketColors: [
    { bg: "#f0fdf4", border: "#bbf7d0", text: "#059669" }, // 0 - lightest
    { bg: "#dcfce7", border: "#6ee7b7", text: "#059669" }, // 1
    { bg: "#a7f3d0", border: "#34d399", text: "#047857" }, // 2
    { bg: "#6ee7b7", border: "#10b981", text: "#047857" }, // 3
    { bg: "#34d399", border: "#059669", text: "#065f46" }, // 4
    { bg: "#10b981", border: "#047857", text: "#ffffff" }, // 5
    { bg: "#059669", border: "#065f46", text: "#ffffff" }, // 6+
  ],
  },

  "pastel-rose": {
    primary: "#E11D48",
    secondary: "#1C1917",
    accent: "#f43f5e",

    primaryLight: "#fb7185",
    primaryDark: "#be123c",

    secondaryLight: "#78716c",
    secondaryDark: "#0c0a09",

    accentLight: "#fb7185",
    accentDark: "#e11d48",

    background: {
      start: "#fff1f2",
      end: "#ffe4e6",
      gradient: "linear-gradient(145deg, #fff1f2 0%, #ffe4e6 100%)",
    },

    gradients: {
      primary: "linear-gradient(90deg, #E11D48 0%, #be123c 100%)",
      primaryHover: "linear-gradient(90deg, #be123c 0%, #9f1239 100%)",
      header: "linear-gradient(90deg, #E11D48 0%, #be123c 50%, #E11D48 100%)",
      card: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(225,29,72,0.04))",
    },

    cardBg: "#ffffff",

    text: {
      primary: "#1C1917",
      secondary: "#57534e",
      light: "#a8a29e",
      white: "#ffffff",
    },

    border: "#f87171",
    mutedBg: "#fff1f2",
    appBarGradient: "linear-gradient(90deg, #E11D48 0%, #be123c 100%)",
    hover: "rgba(225, 29, 72, 0.08)",
  },

  "sage-professional": {
    primary: "#059669",
    secondary: "#1b2e1b",
    accent: "#10b981",

    primaryLight: "#34d399",
    primaryDark: "#047857",

    secondaryLight: "#4b5563",
    secondaryDark: "#111827",

    accentLight: "#34d399",
    accentDark: "#059669",

    background: {
      start: "#f0fdf4",
      end: "#dcfce7",
      gradient: "linear-gradient(145deg, #f0fdf4 0%, #dcfce7 100%)",
    },

    gradients: {
      primary: "linear-gradient(90deg, #059669 0%, #047857 100%)",
      primaryHover: "linear-gradient(90deg, #047857 0%, #065f46 100%)",
      header: "linear-gradient(90deg, #059669 0%, #047857 50%, #059669 100%)",
      card: "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(5,150,105,0.04))",
    },

    cardBg: "#ffffff",

    text: {
      primary: "#111827",
      secondary: "#374151",
      light: "#9ca3af",
      white: "#ffffff",
    },

    border: "#86efac",
    mutedBg: "#f0fdf4",
    appBarGradient: "linear-gradient(90deg, #059669 0%, #047857 100%)",
    hover: "rgba(5, 150, 105, 0.08)",
  },
};


// Default palette
export const defaultPalette = colorPalettes.ADCB;


// Helper function to get colors by realm
export const getColors = (realmRaw) => {
  const realm = realmRaw === "ALHILAL" ? "AL-HILAL" : realmRaw;
  return colorPalettes[realm] || defaultPalette;
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const normalizeHex = (hex) => {
  const raw = String(hex || "").trim().replace("#", "");
  if (raw.length === 3) {
    return `#${raw
      .split("")
      .map((part) => `${part}${part}`)
      .join("")}`.toLowerCase();
  }
  if (raw.length === 6) return `#${raw}`.toLowerCase();
  return "#000000";
};

export const hexToRgb = (hex) => {
  const normalized = normalizeHex(hex);
  const intValue = Number.parseInt(normalized.slice(1), 16);
  return {
    r: (intValue >> 16) & 255,
    g: (intValue >> 8) & 255,
    b: intValue & 255,
  };
};

const rgbToHex = ({ r, g, b }) =>
  `#${[r, g, b]
    .map((value) => clamp(Math.round(value), 0, 255).toString(16).padStart(2, "0"))
    .join("")}`;

export const withAlpha = (hex, alpha = 1) => {
  const { r, g, b } = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
};

export const mixColors = (first, second, weight = 0.5) => {
  const ratio = clamp(weight, 0, 1);
  const rgbA = hexToRgb(first);
  const rgbB = hexToRgb(second);
  return rgbToHex({
    r: rgbA.r + (rgbB.r - rgbA.r) * ratio,
    g: rgbA.g + (rgbB.g - rgbA.g) * ratio,
    b: rgbA.b + (rgbB.b - rgbA.b) * ratio,
  });
};

export const getBucketToneIndex = (bucketValue, maxIndex = 12) => {
  const match = String(bucketValue ?? "").match(/\d+/);
  const parsed = match ? Number.parseInt(match[0], 10) : Number.NaN;
  if (!Number.isFinite(parsed)) return 1;
  return clamp(parsed, 1, maxIndex);
};

export const createBucketToneScale = (palette, steps = 12) => {
  const stepCount = Math.max(1, steps);
  const tones = [];

  for (let index = 0; index < stepCount; index += 1) {
    const progress = stepCount === 1 ? 0 : index / (stepCount - 1);
    const background = mixColors(
      mixColors("#ffffff", palette.primaryLight, 0.16),
      palette.primaryDark,
      progress * 0.78
    );
    const border = mixColors(palette.primary, palette.primaryDark, progress * 0.72);
    const text = progress > 0.56 ? palette.text.white : mixColors(palette.text.primary, palette.primaryDark, 0.26 + progress * 0.52);

    tones.push({
      background,
      border,
      text,
      shadow: withAlpha(border, 0.18 + progress * 0.12),
    });
  }

  return tones;
};

export const createPaletteCssVars = (palette, mode = "light") => {
  const isDark = mode === "dark";
  const bucketTones = createBucketToneScale(palette, 12);
  const neutralLight = mixColors("#e2e8f0", palette.secondaryLight || "#94a3b8", 0.2);
  const neutralDark = mixColors("#334155", palette.secondaryDark || "#475569", 0.3);
  const panelBase = isDark
    ? mixColors(mixColors("#0b1220", palette.secondaryDark, 0.42), palette.primaryDark, 0.32)
    : mixColors(palette.cardBg, palette.background.start, 0.48);
  const paperBase = isDark
    ? mixColors(mixColors("#0f172a", palette.secondaryDark, 0.52), palette.primaryDark, 0.14)
    : palette.cardBg;
  const defaultBg = isDark
    ? mixColors("#020617", palette.secondaryDark, 0.34)
    : mixColors("#ffffff", palette.background.start, 0.72);
  const pageBg = isDark
    ? `radial-gradient(circle at top left, ${withAlpha(palette.primary, 0.14)}, transparent 34%), radial-gradient(circle at top right, ${withAlpha(palette.accent, 0.12)}, transparent 32%), linear-gradient(165deg, ${mixColors(
        "#020617",
        palette.secondaryDark,
        0.48
      )} 0%, ${mixColors("#0f172a", palette.primaryDark, 0.36)} 100%)`
    : palette.background.gradient || palette.gradients?.page || palette.background.start;
  const sidebarBg = isDark
    ? `linear-gradient(180deg, ${mixColors("#0f172a", palette.primaryDark, 0.68)} 0%, ${mixColors("#020617", palette.secondaryDark, 0.54)} 100%)`
    : `linear-gradient(180deg, ${mixColors(palette.primaryDark, palette.secondaryDark, 0.22)} 0%, ${mixColors(palette.primaryDark, "#0f172a", 0.38)} 100%)`;
  const textPrimary = isDark ? "#e5eef7" : palette.text.primary;
  const textSecondary = isDark ? mixColors("#cbd5e1", palette.secondaryLight, 0.42) : palette.text.secondary;
  const textTertiary = isDark ? mixColors("#94a3b8", palette.secondaryLight, 0.35) : mixColors(palette.text.secondary, palette.text.primary, 0.2);
  const divider = isDark ? neutralDark : neutralLight;
  const controlBorder = isDark
    ? mixColors(divider, palette.primary, 0.22)
    : mixColors(divider, palette.primaryLight, 0.18);
  const hoverBg = isDark ? withAlpha(palette.primaryLight, 0.18) : withAlpha(palette.primary, 0.08);
  const selectedBg = isDark ? withAlpha(palette.primary, 0.24) : withAlpha(palette.primary, 0.12);
  const softAccent = isDark ? withAlpha(palette.primary, 0.18) : withAlpha(palette.primaryLight, 0.14);
  const inputBg = isDark
    ? mixColors(mixColors("#111827", palette.secondaryDark, 0.22), palette.primaryDark, 0.18)
    : mixColors("#ffffff", palette.background.start, 0.64);
  const darkHeaderBg = isDark
    ? mixColors(withAlpha(palette.primary, 0.22), mixColors("#1e293b", palette.primaryDark, 0.34), 0.72)
    : mixColors(palette.background.start, "#ffffff", 0.38);

  const cssVars = {
    "--drs-color-primary": palette.primary,
    "--drs-color-primary-light": palette.primaryLight,
    "--drs-color-primary-dark": palette.primaryDark,
    "--drs-color-secondary": palette.secondary,
    "--drs-color-secondary-light": palette.secondaryLight,
    "--drs-color-secondary-dark": palette.secondaryDark,
    "--drs-color-accent": palette.accent,
    "--drs-color-accent-light": palette.accentLight,
    "--drs-color-accent-dark": palette.accentDark,
    "--drs-bg-default": defaultBg,
    "--drs-bg-paper": paperBase,
    "--drs-bg-panel": panelBase,
    "--drs-bg-page": pageBg,
    "--drs-bg-sidebar": sidebarBg,
    "--drs-bg-input": inputBg,
    "--drs-text-primary": textPrimary,
    "--drs-text-secondary": textSecondary,
    "--drs-text-tertiary": textTertiary,
    "--drs-text-inverse": palette.text.white,
    "--drs-border-divider": divider,
    "--drs-control-border": controlBorder,
    "--drs-control-hover-border": palette.primary,
    "--drs-hover-bg": hoverBg,
    "--drs-action-selected": selectedBg,
    "--drs-soft-accent": softAccent,
    "--drs-appbar-gradient": palette.appBarGradient || palette.gradients?.header || palette.gradients?.primary,
    "--drs-button-primary-bg": palette.gradients?.primary || palette.primary,
    "--drs-button-primary-hover": palette.gradients?.primaryHover || palette.primaryDark,
    "--drs-button-outline-bg": isDark ? withAlpha(palette.primary, 0.12) : withAlpha(palette.primary, 0.04),
    "--drs-button-outline-hover": isDark ? withAlpha(palette.primary, 0.18) : withAlpha(palette.primary, 0.08),
    "--drs-button-outline-text": isDark ? palette.primaryLight : palette.primaryDark,
    "--drs-search-bg": isDark ? withAlpha(palette.primaryDark, 0.28) : withAlpha(palette.primary, 0.05),
    "--drs-search-border": isDark ? withAlpha(palette.primaryLight, 0.28) : withAlpha(palette.primary, 0.16),
    "--drs-sidebar-text": isDark ? mixColors("#e2e8f0", palette.secondaryLight, 0.25) : mixColors("#cbd5e1", palette.secondaryLight, 0.34),
    "--drs-sidebar-text-active": "#ffffff",
    "--drs-sidebar-hover": withAlpha("#ffffff", isDark ? 0.12 : 0.1),
    "--drs-sidebar-active": withAlpha("#ffffff", isDark ? 0.18 : 0.16),
    "--drs-checkbox-border": isDark ? mixColors(divider, palette.primary, 0.16) : mixColors(palette.border, palette.primary, 0.22),
    "--drs-checkbox-checked-bg": palette.primary,
    "--drs-checkbox-check-color": palette.text.white,
    "--drs-grid-row-hover": isDark ? withAlpha(palette.primaryLight, 0.12) : withAlpha(palette.primary, 0.02),
    "--drs-grid-row-selected": isDark ? withAlpha(palette.primary, 0.22) : withAlpha(palette.primary, 0.12),
    "--drs-grid-header-bg": isDark ? darkHeaderBg : mixColors(palette.background.start, "#ffffff", 0.38),
    "--drs-grid-odd-row": isDark ? withAlpha(palette.secondaryDark, 0.28) : mixColors("#ffffff", palette.background.start, 0.36),
    "--drs-grid-footer-bg": panelBase,
    "--drs-chip-bg": withAlpha(palette.accent, isDark ? 0.2 : 0.16),
    "--drs-chip-text": isDark ? mixColors("#fff7ed", palette.accentLight, 0.26) : mixColors(palette.accentDark, "#7c2d12", 0.18),
  };

  bucketTones.forEach((tone, index) => {
    const step = index + 1;
    cssVars[`--drs-bucket-${step}-bg`] = tone.background;
    cssVars[`--drs-bucket-${step}-border`] = tone.border;
    cssVars[`--drs-bucket-${step}-text`] = tone.text;
    cssVars[`--drs-bucket-${step}-shadow`] = tone.shadow;
  });

  return cssVars;
};
export const getBucketColor = (colors, bucketNum) => {
  const palette = colors?.bucketColors;
  if (!palette?.length) {
    // Fallback if palette has no bucketColors
    return bucketNum > 4
      ? { bg: "#fee2e2", border: "#fca5a5", text: "#b91c1c" }
      : bucketNum > 2
      ? { bg: "#ffedd5", border: "#fdba74", text: "#c2410c" }
      : { bg: "#dcfce7", border: "#86efac", text: "#15803d" };
  }
  const index = Math.min(bucketNum, palette.length - 1);
  return palette[Math.max(0, index)];
};
