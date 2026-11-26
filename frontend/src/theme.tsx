import { ruRU } from "@mui/material/locale";
import { getUiLanguage } from "./i18n";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";

// Явный выбор темы. Без него действует системная тема.
const THEME_KEY = "rowlore_theme";
// До Rowlore выбор сохранялся всегда, по умолчанию — «light». Явным считаем только «dark».
const LEGACY_THEME_KEY = "review_analyzer_theme_preference";

type Mode = "light" | "dark";
type ThemeModeContextValue = {
  mode: Mode;
  toggle: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextValue>({
  mode: "light",
  toggle: () => undefined,
});

export function useThemeMode(): ThemeModeContextValue {
  return useContext(ThemeModeContext);
}

function readPreference(): Mode | null {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") return saved;
    if (localStorage.getItem(LEGACY_THEME_KEY) === "dark") return "dark";
  } catch {
    // Без хранилища — как в системе.
  }
  return null;
}

function writePreference(mode: Mode | null) {
  try {
    if (mode) localStorage.setItem(THEME_KEY, mode);
    else localStorage.removeItem(THEME_KEY);
    localStorage.removeItem(LEGACY_THEME_KEY);
  } catch {
    // Выбор действует до перезагрузки страницы.
  }
}

const darkQuery = () => window.matchMedia?.("(prefers-color-scheme: dark)");

function systemMode(): Mode {
  return darkQuery()?.matches ? "dark" : "light";
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreference] = useState<Mode | null>(readPreference);
  const [system, setSystem] = useState<Mode>(systemMode);
  const mode: Mode = preference ?? system;

  useEffect(() => {
    const query = darkQuery();
    if (!query) return;
    const changed = () => setSystem(query.matches ? "dark" : "light");
    query.addEventListener("change", changed);
    return () => query.removeEventListener("change", changed);
  }, []);

  const value = useMemo(
    () => ({
      mode,
      toggle: () => {
        const next: Mode = mode === "dark" ? "light" : "dark";
        // Выбор, совпадающий с системой, не сохраняется: дальше тема снова следует за системой.
        const saved = next === systemMode() ? null : next;
        writePreference(saved);
        setPreference(saved);
      },
    }),
    [mode],
  );

  const theme = useMemo(() => {
    // Атрибут ставится до чтения токенов: палитра MUI берёт значения из CSS-переменных текущей темы.
    document.documentElement.setAttribute("data-theme", mode);
    return createAppTheme(mode);
  }, [mode]);

  return (
    <ThemeModeContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
}

/** Значение CSS-переменной из tokens.css для текущей темы. */
function token(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

const disabledContained = (ownerState: { href?: string; component?: unknown }) => ({
  background: "var(--idle-bg)",
  color: "var(--ink-3)",
  cursor: "not-allowed",
  pointerEvents: (ownerState.href || (ownerState.component && ownerState.component !== "button") ? "none" : "auto") as "none" | "auto",
});

export function createAppTheme(mode: Mode) {
  return createTheme(
    {
      palette: {
        mode,
        primary: { main: token("--accent"), dark: token("--accent-strong"), contrastText: token("--on-accent") },
        secondary: { main: token("--ink-2") },
        background: { default: token("--bg"), paper: token("--surface") },
        text: { primary: token("--ink"), secondary: token("--ink-3") },
        divider: token("--line"),
        success: { main: token("--ok") },
        warning: { main: token("--warn") },
        error: { main: token("--bad") },
        info: { main: token("--info") },
      },
      shape: { borderRadius: parseFloat(token("--r-control")) || 10 },
      typography: {
        fontFamily: token("--font"),
        h4: { fontWeight: 800, letterSpacing: "-0.025em" },
        h5: { fontWeight: 700, letterSpacing: "-0.02em" },
        h6: { fontWeight: 700, letterSpacing: "-0.015em" },
        subtitle1: { fontWeight: 600 },
        subtitle2: { fontWeight: 600 },
        button: { fontWeight: 600, letterSpacing: "-0.005em" },
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: { fontFeatureSettings: '"tnum" 1, "ss01" 1' },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: { borderRadius: "var(--r-card)" },
          },
        },
        MuiPaper: {
          styleOverrides: {
            rounded: { borderRadius: "var(--r-card)" },
          },
        },
        MuiDialog: {
          styleOverrides: {
            paper: { borderRadius: "var(--r-dialog)", boxShadow: "var(--shadow-pop)" },
          },
        },
        MuiButton: {
          defaultProps: { disableElevation: true },
          styleOverrides: {
            root: {
              borderRadius: "var(--r-control)",
              textTransform: "none",
              fontWeight: 600,
              paddingInline: 16,
            },
            containedPrimary: ({ ownerState }) => ({
              background: "linear-gradient(135deg, var(--accent), var(--accent-strong))",
              color: "var(--on-accent)",
              "&:hover": { filter: "brightness(1.06)" },
              "&.Mui-disabled": disabledContained(ownerState as { href?: string; component?: unknown }),
            }),
            containedSuccess: ({ ownerState }) => ({
              background: "var(--ok)",
              color: "var(--on-accent)",
              "&:hover": { background: "var(--ok)", filter: "brightness(1.08)" },
              "&.Mui-disabled": disabledContained(ownerState as { href?: string; component?: unknown }),
            }),
            outlined: {
              borderColor: "var(--line-strong)",
              "&:hover": { borderColor: "var(--accent)" },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: { fontWeight: 600, borderRadius: "var(--r-chip)", letterSpacing: "-0.005em" },
          },
        },
        MuiTextField: { defaultProps: { size: "small" } },
        MuiSelect: { defaultProps: { size: "small" } },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              borderRadius: "var(--r-control)",
              backgroundColor: "var(--surface-2)",
              transition: "box-shadow .18s",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--line-strong)" },
              "&:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline": { borderColor: "var(--ink-3)" },
              "&.Mui-focused": { boxShadow: "0 0 0 3px var(--accent-soft)" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "var(--accent)", borderWidth: 1 },
            },
          },
        },
        MuiTableCell: {
          styleOverrides: {
            head: {
              fontSize: "var(--t-xs)",
              fontWeight: 700,
              color: "var(--ink-3)",
              borderBottomColor: "var(--line-strong)",
            },
            body: { borderBottomColor: "var(--line)" },
          },
        },
        MuiLinearProgress: {
          styleOverrides: {
            root: { height: 8, borderRadius: 999, backgroundColor: "var(--idle-bg)" },
            bar: { borderRadius: 999 },
          },
        },
        MuiTabs: {
          styleOverrides: {
            indicator: { height: 3, background: "linear-gradient(90deg, var(--accent), var(--accent-strong))" },
          },
        },
        MuiToggleButton: {
          styleOverrides: {
            root: { textTransform: "none", fontWeight: 600 },
          },
        },
        MuiTooltip: { defaultProps: { arrow: true } },
        MuiAlert: {
          styleOverrides: {
            root: { borderRadius: "var(--r-control)" },
          },
        },
      },
    },
    getUiLanguage() === "ru" ? ruRU : {},
  );
}
