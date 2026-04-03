/**
 * ASHIANA — Global Theme File
 * ============================================================
 * Location: src/theme/theme.ts
 *
 * This is the SINGLE SOURCE OF TRUTH for all visual design
 * decisions in the Ashiana Housing Platform.
 *
 * To change the look of the entire app, edit values here.
 * Chakra UI will propagate them everywhere automatically.
 *
 * Sections:
 *   1. Color Palette (raw tokens)
 *   2. Semantic Tokens (light + dark mode)
 *   3. Typography
 *   4. Spacing & Radius
 *   5. Shadows
 *   6. Component Overrides
 *   7. Global Styles
 * ============================================================
 */

import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// ─────────────────────────────────────────────
// 1. COLOR PALETTE — Raw Design Tokens
//    These are the building blocks. Never use
//    these directly in components — use semantic
//    tokens below instead.
// ─────────────────────────────────────────────
const palette = {
  // Primary — warm terracotta/brick
  // Evokes clay-built homes, warmth, shelter
  brand: {
    50:  "#FFF4EE",
    100: "#FFE2CF",
    200: "#FFBF9B",
    300: "#FF9462",
    400: "#F76A2D",
    500: "#E05214",   // ← Primary brand color
    600: "#B53E0C",
    700: "#8A2E08",
    800: "#622006",
    900: "#3A1203",
  },

  // Neutral — warm off-white to deep charcoal
  // Warm-tinted grays (not cold blue-grays)
  stone: {
    50:  "#FAFAF8",
    100: "#F2F1EE",
    200: "#E4E2DC",
    300: "#CBC8BF",
    400: "#A9A59A",
    500: "#857F74",
    600: "#645F55",
    700: "#49443B",
    800: "#2E2B24",
    900: "#1A1815",
  },

  // Accent — muted olive/sage green
  // Represents growth, new beginnings, outdoor spaces
  sage: {
    50:  "#F4F7F0",
    100: "#E2ECD8",
    200: "#C4D9B1",
    300: "#A0C085",
    400: "#7DA55C",
    500: "#5F8B3F",   // ← Accent color (e.g. verified badge, success)
    600: "#4A6D30",
    700: "#365022",
    800: "#233516",
    900: "#111A0A",
  },

  // Gold — for premium listings, ratings, highlights
  gold: {
    50:  "#FFFBEB",
    100: "#FEF3C7",
    200: "#FDE68A",
    300: "#FCD34D",
    400: "#FBBF24",
    500: "#F59E0B",
    600: "#D97706",
    700: "#B45309",
    800: "#92400E",
    900: "#78350F",
  },

  // Status colors
  crimson: {
    50:  "#FFF1F1",
    100: "#FFD9D9",
    200: "#FFA8A8",
    300: "#FF6B6B",
    400: "#FA3838",
    500: "#E01B1B",
    600: "#B51414",
    700: "#8A0F0F",
  },

  sky: {
    50:  "#EFF8FF",
    100: "#DBEFFE",
    200: "#B0DAFD",
    300: "#76BBFC",
    400: "#3B97F8",
    500: "#1A79EC",
    600: "#1060CF",
  },
};

// ─────────────────────────────────────────────
// 2. SEMANTIC TOKENS
//    Map raw palette colors to meaningful roles.
//    These adapt automatically for light/dark mode.
//    USE THESE in your components, not raw palette.
//
//    Usage in component:
//    color="text.primary"
//    bg="surface.card"
//    borderColor="border.default"
// ─────────────────────────────────────────────
const semanticTokens = {
  colors: {
    // — Page backgrounds —
    "bg.page": {
      default: palette.stone[50],         // warm off-white in light
      _dark:   palette.stone[900],        // deep charcoal in dark
    },
    "bg.subtle": {
      default: palette.stone[100],
      _dark:   palette.stone[800],
    },

    // — Surface (cards, panels, modals) —
    "surface.card": {
      default: "#FFFFFF",
      _dark:   palette.stone[800],
    },
    "surface.overlay": {
      default: "rgba(255,255,255,0.92)",
      _dark:   "rgba(30,27,22,0.95)",
    },
    "surface.sidebar": {
      default: palette.stone[100],
      _dark:   "#1F1D18",
    },
    "surface.navbar": {
      default: "rgba(255,255,255,0.88)",
      _dark:   "rgba(26,24,21,0.92)",
    },

    // — Text —
    "text.primary": {
      default: palette.stone[900],
      _dark:   palette.stone[50],
    },
    "text.secondary": {
      default: palette.stone[600],
      _dark:   palette.stone[300],
    },
    "text.muted": {
      default: palette.stone[400],
      _dark:   palette.stone[500],
    },
    "text.inverse": {
      default: "#FFFFFF",
      _dark:   palette.stone[900],
    },
    "text.onBrand": {
      default: "#FFFFFF",
      _dark:   "#FFFFFF",
    },

    // — Brand / Primary actions —
    "brand.primary": {
      default: palette.brand[500],
      _dark:   palette.brand[400],
    },
    "brand.hover": {
      default: palette.brand[600],
      _dark:   palette.brand[300],
    },
    "brand.subtle": {
      default: palette.brand[50],
      _dark:   "rgba(224,82,20,0.12)",
    },
    "brand.border": {
      default: palette.brand[200],
      _dark:   palette.brand[700],
    },

    // — Accent (sage green) —
    "accent.primary": {
      default: palette.sage[500],
      _dark:   palette.sage[400],
    },
    "accent.subtle": {
      default: palette.sage[50],
      _dark:   "rgba(95,139,63,0.12)",
    },

    // — Borders —
    "border.default": {
      default: palette.stone[200],
      _dark:   palette.stone[700],
    },
    "border.strong": {
      default: palette.stone[300],
      _dark:   palette.stone[600],
    },
    "border.focus": {
      default: palette.brand[500],
      _dark:   palette.brand[400],
    },

    // — Status —
    "status.success": {
      default: palette.sage[500],
      _dark:   palette.sage[400],
    },
    "status.error": {
      default: palette.crimson[500],
      _dark:   palette.crimson[400],
    },
    "status.warning": {
      default: palette.gold[500],
      _dark:   palette.gold[400],
    },
    "status.info": {
      default: palette.sky[500],
      _dark:   palette.sky[400],
    },
    "status.successBg": {
      default: palette.sage[50],
      _dark:   "rgba(95,139,63,0.12)",
    },
    "status.errorBg": {
      default: palette.crimson[50],
      _dark:   "rgba(224,27,27,0.12)",
    },

    // — Property card specific —
    "property.badge.sale": {
      default: palette.brand[500],
      _dark:   palette.brand[400],
    },
    "property.badge.rent": {
      default: palette.sky[500],
      _dark:   palette.sky[400],
    },
    "property.badge.verified": {
      default: palette.sage[500],
      _dark:   palette.sage[400],
    },
    "property.priceTag": {
      default: palette.stone[900],
      _dark:   palette.stone[50],
    },

    // — Rating stars —
    "rating.star": {
      default: palette.gold[400],
      _dark:   palette.gold[400],
    },
    "rating.starEmpty": {
      default: palette.stone[300],
      _dark:   palette.stone[600],
    },

    // — Navbar active link —
    "nav.active": {
      default: palette.brand[500],
      _dark:   palette.brand[400],
    },
    "nav.hover": {
      default: palette.stone[100],
      _dark:   palette.stone[700],
    },
  },
};

// ─────────────────────────────────────────────
// 3. TYPOGRAPHY
//    Font stack + scale used across the entire app.
//    Import these fonts in layout.tsx:
//
//    import { DM_Serif_Display, Plus_Jakarta_Sans }
//      from "next/font/google"
//
//    Display font (headings): DM Serif Display
//    Body font (everything else): Plus Jakarta Sans
// ─────────────────────────────────────────────
const fonts = {
  heading: `"DM Serif Display", Georgia, serif`,
  body:    `"Plus Jakarta Sans", -apple-system, sans-serif`,
  mono:    `"JetBrains Mono", "Fira Code", monospace`,
};

const fontSizes = {
  "2xs": "0.625rem",   //  10px
  xs:    "0.75rem",    //  12px
  sm:    "0.875rem",   //  14px
  md:    "1rem",       //  16px — body default
  lg:    "1.125rem",   //  18px
  xl:    "1.25rem",    //  20px
  "2xl": "1.5rem",     //  24px
  "3xl": "1.875rem",   //  30px
  "4xl": "2.25rem",    //  36px
  "5xl": "3rem",       //  48px — hero titles
  "6xl": "3.75rem",    //  60px
};

const fontWeights = {
  normal:   400,
  medium:   500,
  semibold: 600,
  bold:     700,
};

const lineHeights = {
  tight:  1.2,   // headings
  snug:   1.4,   // subheadings
  normal: 1.6,   // body text
  relaxed:1.8,   // long-form content
};

const letterSpacings = {
  tighter: "-0.03em",
  tight:   "-0.01em",
  normal:  "0",
  wide:    "0.02em",
  wider:   "0.05em",
  widest:  "0.1em",   // badge labels, caps
};

// ─────────────────────────────────────────────
// 4. SPACING & RADIUS
// ─────────────────────────────────────────────
const space = {
  px:   "1px",
  0.5:  "0.125rem",
  1:    "0.25rem",
  2:    "0.5rem",
  3:    "0.75rem",
  4:    "1rem",
  5:    "1.25rem",
  6:    "1.5rem",
  8:    "2rem",
  10:   "2.5rem",
  12:   "3rem",
  16:   "4rem",
  20:   "5rem",
  24:   "6rem",
  32:   "8rem",
  40:   "10rem",
  48:   "12rem",
  56:   "14rem",
  64:   "16rem",

  // App-specific named spacers
  navHeight:     "4rem",     // 64px fixed navbar height
  sidebarWidth:  "16rem",    // 256px sidebar
  cardGap:       "1.5rem",   // gap between property cards
  sectionPadding:"4rem 1.5rem", // page section padding
  containerMax:  "80rem",    // 1280px max content width
};

const radii = {
  none: "0",
  sm:   "0.25rem",   //  4px — small tags, badges
  md:   "0.5rem",    //  8px — inputs, small cards
  lg:   "0.75rem",   // 12px — cards
  xl:   "1rem",      // 16px — modals, drawers
  "2xl":"1.5rem",    // 24px — hero cards
  full: "9999px",    // pills, avatars
};

// ─────────────────────────────────────────────
// 5. SHADOWS
// ─────────────────────────────────────────────
const shadows = {
  // Warm-tinted shadows (not cold gray)
  xs:   "0 1px 2px 0 rgba(58, 18, 3, 0.05)",
  sm:   "0 1px 3px 0 rgba(58, 18, 3, 0.08), 0 1px 2px -1px rgba(58, 18, 3, 0.04)",
  md:   "0 4px 6px -1px rgba(58, 18, 3, 0.08), 0 2px 4px -2px rgba(58, 18, 3, 0.04)",
  lg:   "0 10px 15px -3px rgba(58, 18, 3, 0.08), 0 4px 6px -4px rgba(58, 18, 3, 0.04)",
  xl:   "0 20px 25px -5px rgba(58, 18, 3, 0.08), 0 8px 10px -6px rgba(58, 18, 3, 0.04)",
  "2xl":"0 25px 50px -12px rgba(58, 18, 3, 0.18)",

  // Brand glow — use on hover states, CTAs
  brand:   "0 0 0 3px rgba(224, 82, 20, 0.2)",
  brandSm: "0 0 0 2px rgba(224, 82, 20, 0.15)",

  // Card hover lift
  cardHover: "0 8px 24px rgba(58, 18, 3, 0.12)",

  // Navbar scroll shadow
  navbar: "0 1px 8px rgba(58, 18, 3, 0.08)",

  // Focus ring (accessibility)
  focus: "0 0 0 3px rgba(224, 82, 20, 0.35)",
};

// ─────────────────────────────────────────────
// 6. COMPONENT STYLE OVERRIDES
//    Chakra component default styles tuned for
//    Ashiana's design language.
// ─────────────────────────────────────────────
const components = {
  // ── Button ──────────────────────────────────
  Button: {
    baseStyle: {
      fontFamily: "body",
      fontWeight: "semibold",
      borderRadius: "md",
      transition: "all 0.18s ease",
      _focus: { boxShadow: "focus", outline: "none" },
    },
    variants: {
      // Primary CTA — Buy, Rent, Submit
      solid: {
        bg: "brand.primary",
        color: "white",
        _hover: { bg: "brand.hover", transform: "translateY(-1px)", boxShadow: "md" },
        _active: { bg: "brand.hover", transform: "translateY(0)" },
        _disabled: { opacity: 0.5, cursor: "not-allowed", transform: "none" },
      },
      // Secondary — Cancel, Back
      outline: {
        borderColor: "border.default",
        color: "text.primary",
        bg: "transparent",
        _hover: { bg: "bg.subtle", borderColor: "border.strong" },
      },
      // Ghost — nav links, icon buttons
      ghost: {
        color: "text.secondary",
        _hover: { bg: "bg.subtle", color: "text.primary" },
      },
      // Danger — Delete listing, Remove user
      danger: {
        bg: "status.error",
        color: "white",
        _hover: { bg: "crimson.600", transform: "translateY(-1px)" },
      },
      // Success — Verified, Confirm payment
      success: {
        bg: "status.success",
        color: "white",
        _hover: { bg: "sage.600" },
      },
    },
    sizes: {
      sm: { h: "2rem",  px: "0.875rem", fontSize: "sm" },
      md: { h: "2.5rem",px: "1.25rem",  fontSize: "sm" },
      lg: { h: "3rem",  px: "1.5rem",   fontSize: "md" },
      xl: { h: "3.5rem",px: "2rem",     fontSize: "lg" },
    },
    defaultProps: { variant: "solid", size: "md" },
  },

  // ── Input ────────────────────────────────────
  Input: {
    baseStyle: {
      field: {
        fontFamily: "body",
        borderRadius: "md",
        transition: "all 0.15s ease",
        _placeholder: { color: "text.muted" },
      },
    },
    variants: {
      outline: {
        field: {
          bg: "surface.card",
          borderColor: "border.default",
          _hover:  { borderColor: "border.strong" },
          _focus:  { borderColor: "brand.primary", boxShadow: "brand", bg: "surface.card" },
          _invalid:{ borderColor: "status.error",  boxShadow: "0 0 0 2px rgba(224,27,27,0.2)" },
        },
      },
    },
    sizes: {
      md: { field: { h: "2.75rem", fontSize: "sm", px: "1rem" } },
      lg: { field: { h: "3.25rem", fontSize: "md", px: "1.25rem" } },
    },
    defaultProps: { variant: "outline", size: "md" },
  },

  // ── Select (same as Input) ───────────────────
  Select: {
    variants: {
      outline: {
        field: {
          bg: "surface.card",
          borderColor: "border.default",
          _hover: { borderColor: "border.strong" },
          _focus: { borderColor: "brand.primary", boxShadow: "brand" },
        },
      },
    },
    defaultProps: { variant: "outline" },
  },

  // ── Textarea ─────────────────────────────────
  Textarea: {
    variants: {
      outline: {
        bg: "surface.card",
        borderColor: "border.default",
        _hover: { borderColor: "border.strong" },
        _focus: { borderColor: "brand.primary", boxShadow: "brand" },
        _placeholder: { color: "text.muted" },
      },
    },
    defaultProps: { variant: "outline" },
  },

  // ── Card ─────────────────────────────────────
  Card: {
    baseStyle: {
      container: {
        bg: "surface.card",
        borderRadius: "lg",
        boxShadow: "sm",
        border: "1px solid",
        borderColor: "border.default",
        overflow: "hidden",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        _hover: { boxShadow: "cardHover", transform: "translateY(-2px)" },
      },
    },
  },

  // ── Badge ─────────────────────────────────────
  Badge: {
    baseStyle: {
      fontFamily: "body",
      fontWeight: "semibold",
      fontSize: "2xs",
      letterSpacing: "widest",
      textTransform: "uppercase",
      borderRadius: "sm",
      px: 2,
      py: 0.5,
    },
    variants: {
      sale:     { bg: "property.badge.sale",     color: "white" },
      rent:     { bg: "property.badge.rent",     color: "white" },
      verified: { bg: "property.badge.verified", color: "white" },
      pending:  { bg: "gold.100",                color: "gold.800" },
      resolved: { bg: "sage.100",                color: "sage.800" },
    },
  },

  // ── Heading ──────────────────────────────────
  Heading: {
    baseStyle: {
      fontFamily: "heading",
      fontWeight: "normal",     // DM Serif Display looks best unbolded
      lineHeight: "tight",
      letterSpacing: "tight",
      color: "text.primary",
    },
  },

  // ── Text ─────────────────────────────────────
  Text: {
    baseStyle: {
      fontFamily: "body",
      color: "text.primary",
      lineHeight: "normal",
    },
    variants: {
      muted:     { color: "text.secondary", fontSize: "sm" },
      label:     { color: "text.muted",     fontSize: "xs", fontWeight: "medium", letterSpacing: "wider", textTransform: "uppercase" },
      price:     { color: "text.primary",   fontWeight: "bold", fontSize: "xl" },
      caption:   { color: "text.muted",     fontSize: "xs" },
    },
  },

  // ── Divider ──────────────────────────────────
  Divider: {
    baseStyle: {
      borderColor: "border.default",
      opacity: 1,
    },
  },

  // ── Modal ────────────────────────────────────
  Modal: {
    baseStyle: {
      dialog: {
        bg: "surface.card",
        borderRadius: "xl",
        boxShadow: "2xl",
      },
      overlay: {
        bg: "rgba(26, 24, 21, 0.6)",
        backdropFilter: "blur(4px)",
      },
    },
  },

  // ── Drawer ───────────────────────────────────
  Drawer: {
    baseStyle: {
      dialog: {
        bg: "surface.card",
      },
    },
  },

  // ── Tabs ─────────────────────────────────────
  Tabs: {
    variants: {
      line: {
        tab: {
          color: "text.secondary",
          fontWeight: "medium",
          _selected: { color: "brand.primary", borderColor: "brand.primary" },
          _hover:    { color: "text.primary" },
        },
      },
      "soft-rounded": {
        tab: {
          borderRadius: "full",
          fontWeight: "medium",
          color: "text.secondary",
          _selected: { bg: "brand.subtle", color: "brand.primary" },
        },
      },
    },
    defaultProps: { variant: "line" },
  },

  // ── Menu ─────────────────────────────────────
  Menu: {
    baseStyle: {
      list: {
        bg: "surface.card",
        borderColor: "border.default",
        boxShadow: "lg",
        borderRadius: "lg",
        py: 1,
      },
      item: {
        bg: "surface.card",
        color: "text.primary",
        fontSize: "sm",
        _hover: { bg: "bg.subtle" },
        _focus: { bg: "bg.subtle" },
      },
    },
  },

  // ── Alert ────────────────────────────────────
  Alert: {
    variants: {
      subtle: {
        container: { borderRadius: "md" },
      },
    },
  },

  // ── Skeleton ─────────────────────────────────
  Skeleton: {
    baseStyle: {
      borderRadius: "md",
    },
  },

  // ── FormLabel ────────────────────────────────
  FormLabel: {
    baseStyle: {
      fontFamily: "body",
      fontWeight: "medium",
      fontSize: "sm",
      color: "text.secondary",
      mb: 1,
    },
  },

  // ── Tooltip ──────────────────────────────────
  Tooltip: {
    baseStyle: {
      bg: "stone.800",
      color: "white",
      borderRadius: "md",
      fontSize: "xs",
      px: 3,
      py: 1.5,
    },
  },
};

// ─────────────────────────────────────────────
// 7. GLOBAL STYLES
//    Applied to every page, every element.
// ─────────────────────────────────────────────
const styles = {
  global: (props: { colorMode: string }) => ({
    "*, *::before, *::after": {
      boxSizing: "border-box",
    },
    html: {
      scrollBehavior: "smooth",
    },
    body: {
      bg: "bg.page",
      color: "text.primary",
      fontFamily: "body",
      fontSize: "md",
      lineHeight: "normal",
      WebkitFontSmoothing: "antialiased",
      MozOsxFontSmoothing: "grayscale",
    },
    // Scrollbar styling (Webkit)
    "::-webkit-scrollbar": { width: "6px", height: "6px" },
    "::-webkit-scrollbar-track": { bg: "transparent" },
    "::-webkit-scrollbar-thumb": {
      bg: props.colorMode === "dark" ? "stone.600" : "stone.300",
      borderRadius: "full",
    },
    "::-webkit-scrollbar-thumb:hover": {
      bg: props.colorMode === "dark" ? "stone.500" : "stone.400",
    },
    // Selection color
    "::selection": {
      bg: "brand.100",
      color: "brand.900",
    },
    // Focus visible (keyboard nav)
    ":focus-visible": {
      outline: "2px solid",
      outlineColor: "brand.primary",
      outlineOffset: "2px",
    },
    // Anchor resets
    a: {
      color: "inherit",
      textDecoration: "none",
      _hover: { textDecoration: "none" },
    },
    // Image default
    img: {
      maxWidth: "100%",
      height: "auto",
    },
  }),
};

// ─────────────────────────────────────────────
// 8. COLOR MODE CONFIG
// ─────────────────────────────────────────────
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,   // set true to follow OS preference
  disableTransitionOnChange: false,
};

// ─────────────────────────────────────────────
// ASSEMBLE & EXPORT
// ─────────────────────────────────────────────
const theme = extendTheme({
  config,
  colors: palette,
  semanticTokens,
  fonts,
  fontSizes,
  fontWeights,
  lineHeights,
  letterSpacings,
  space,
  radii,
  shadows,
  components,
  styles,
});

export default theme;

// ─────────────────────────────────────────────
// USAGE CHEATSHEET
// ─────────────────────────────────────────────
//
// In any component:
//   import { useColorModeValue } from "@chakra-ui/react"
//
//   // Responsive to light/dark automatically via semantic tokens:
//   <Box bg="surface.card" color="text.primary">
//   <Button variant="solid">Buy Now</Button>
//   <Badge variant="sale">For Sale</Badge>
//   <Text variant="price">PKR 1.2 Cr</Text>
//
//   // Raw palette (only when semantic token doesn't fit):
//   <Box bg="brand.500">
//
//   // Dark/light manual override:
//   const bg = useColorModeValue("stone.50", "stone.900")
//
// Toggle dark mode from anywhere:
//   import { useColorMode } from "@chakra-ui/react"
//   const { toggleColorMode } = useColorMode()