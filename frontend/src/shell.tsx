import type { MouseEvent, ReactNode } from "react";
import { Box, ButtonBase, Typography } from "@mui/material";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import { uiText } from "./i18n";
import "./shell.css";

export const PRODUCT_NAME = "Rowlore";

/** Знак и имя продукта. Знак можно заменить своим файлом в branding/. */
export function Brand({ logoSrc, onLogoError, className = "" }: {
  logoSrc: string;
  onLogoError?: () => void;
  className?: string;
}) {
  return <Box className={`shell-brand ${className}`.trim()}>
    <img src={logoSrc} alt="" width={26} height={26} className="shell-brand-mark" onError={onLogoError} />
    <span className="shell-brand-name">{PRODUCT_NAME}</span>
  </Box>;
}

type LinkProps = {
  label: ReactNode;
  href?: string;
  onClick?: () => void;
  current?: boolean;
  count?: number;
  className?: string;
};

/** Пункт бокового меню: ссылка на раздел или кнопка. Как в Cubelore — текстом, без иконок. */
export function ShellLink({ label, href, onClick, current, count, className = "" }: LinkProps) {
  const classes = ["shell-link", current ? "on" : "", className].filter(Boolean).join(" ");
  const content = <>
    <span className="shell-link-label">{label}</span>
    {count ? <span className="shell-count">{count}</span> : null}
  </>;
  if (href) {
    return <a className={classes} href={href} aria-current={current ? "page" : undefined}>{content}</a>;
  }
  return <ButtonBase className={classes} onClick={onClick} aria-current={current ? "page" : undefined} disableRipple>
    {content}
  </ButtonBase>;
}

export type ShellStep = { id: string; label: string; href: string; done: boolean; current: boolean };

/** Нумерованные шаги мастера: пройденный — галочка, текущий — акцент. */
export function ShellSteps({ label, steps }: { label: string; steps: ShellStep[] }) {
  return <Box component="nav" className="shell-steps" aria-label={label}>
    {steps.map((step, index) => <a
      key={step.id}
      href={step.href}
      className={["shell-step", step.done ? "done" : "", step.current ? "on" : ""].filter(Boolean).join(" ")}
      aria-current={step.current ? "step" : undefined}
    >
      <span className="shell-step-no" aria-hidden="true">{step.done ? "✓" : index + 1}</span>
      {step.label}
    </a>)}
  </Box>;
}

/**
 * Низ меню: тема и пользователь, как в Cubelore. Имя открывает меню аккаунта
 * (расход токенов, правила, заметки о релизе). На узком экране — значки вместо подписей.
 */
export function ShellFooter({ mode, onToggleTheme, name, caption, menuOpen, onOpenMenu, onLogout }: {
  mode: "light" | "dark";
  onToggleTheme: () => void;
  name: ReactNode;
  caption: ReactNode;
  menuOpen: boolean;
  onOpenMenu: (event: MouseEvent<HTMLElement>) => void;
  onLogout: () => void;
}) {
  const themeLabel = mode === "dark" ? uiText("Светлая тема") : uiText("Тёмная тема");
  return <Box className="shell-footer">
    <ButtonBase className="shell-link shell-theme" onClick={onToggleTheme} aria-label={themeLabel} disableRipple>
      <span className="shell-compact-icon" aria-hidden="true">
        {mode === "dark" ? <LightModeOutlinedIcon fontSize="small" /> : <DarkModeOutlinedIcon fontSize="small" />}
      </span>
      <span className="shell-link-label">{themeLabel}</span>
    </ButtonBase>
    <Box className="shell-who">
      <ButtonBase
        className="shell-account"
        onClick={onOpenMenu}
        aria-label={uiText("Меню пользователя")}
        aria-haspopup="menu"
        aria-expanded={menuOpen}
        disableRipple
      >
        <span className="shell-compact-icon" aria-hidden="true"><PersonOutlineIcon fontSize="small" /></span>
        <span className="shell-account-text">
          <Typography component="span" className="shell-account-name">{name}</Typography>
          <Typography component="span" className="shell-account-caption">{caption}</Typography>
        </span>
      </ButtonBase>
      <ButtonBase className="shell-logout" onClick={onLogout} disableRipple>{uiText("Выйти")}</ButtonBase>
    </Box>
  </Box>;
}

/** Оболочка экранов: меню слева, содержимое справа. На узком экране меню уходит наверх. */
export function AppShell({ navLabel, brand, nav, footer, children, className = "", mainId = "shell-main", skipLabel }: {
  navLabel: string;
  brand: ReactNode;
  nav: ReactNode;
  footer: ReactNode;
  children: ReactNode;
  className?: string;
  mainId?: string;
  skipLabel?: string;
}) {
  return <Box className={`page app-shell ${className}`.trim()}>
    {skipLabel && <a className="shell-skip" href={`#${mainId}`}>{skipLabel}</a>}
    <Box component="nav" className="shell-nav" aria-label={navLabel}>
      {brand}
      <Box className="shell-links">{nav}</Box>
      <Box className="shell-spacer" />
      {footer}
    </Box>
    <Box component="main" className="shell-main" id={mainId} tabIndex={-1}>
      {children}
    </Box>
  </Box>;
}

/** Заголовок экрана: название, подпись и действия справа. */
export function ShellHead({ title, sub, crumbs, actions }: {
  title: ReactNode;
  sub?: ReactNode;
  crumbs?: ReactNode;
  actions?: ReactNode;
}) {
  return <Box className="shell-head">
    <Box sx={{ minWidth: 0 }}>
      {crumbs && <Typography component="div" className="shell-crumbs">{crumbs}</Typography>}
      <Typography component="h1" className="shell-title">{title}</Typography>
      {sub && <Typography component="p" className="shell-sub">{sub}</Typography>}
    </Box>
    {actions && <Box className="shell-actions">{actions}</Box>}
  </Box>;
}
