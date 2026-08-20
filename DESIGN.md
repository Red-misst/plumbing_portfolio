---
name: Ridge & Flow
colors:
  surface: '#fcf9f2'
  surface-dim: '#dcdad3'
  surface-bright: '#fcf9f2'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ec'
  surface-container: '#f1eee7'
  surface-container-high: '#ebe8e1'
  surface-container-highest: '#e5e2db'
  on-surface: '#1c1c18'
  on-surface-variant: '#444748'
  inverse-surface: '#31312c'
  inverse-on-surface: '#f3f0e9'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#010101'
  on-primary: '#ffffff'
  primary-container: '#1c1c1c'
  on-primary-container: '#858484'
  inverse-primary: '#c8c6c5'
  secondary: '#a63b10'
  on-secondary: '#ffffff'
  secondary-container: '#fd7a4c'
  on-secondary-container: '#681d00'
  tertiary: '#000105'
  on-tertiary: '#ffffff'
  tertiary-container: '#001d39'
  on-tertiary-container: '#6886af'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474746'
  secondary-fixed: '#ffdbd0'
  secondary-fixed-dim: '#ffb59d'
  on-secondary-fixed: '#390c00'
  on-secondary-fixed-variant: '#832600'
  tertiary-fixed: '#d3e4ff'
  tertiary-fixed-dim: '#aac9f4'
  on-tertiary-fixed: '#001c38'
  on-tertiary-fixed-variant: '#29486d'
  background: '#fcf9f2'
  on-background: '#1c1c18'
  surface-variant: '#e5e2db'
typography:
  h1:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  h1-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.01em
  h2:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h2-mobile:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  h3:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.3'
  body-lg:
    fontFamily: DM Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: DM Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-mono:
    fontFamily: DM Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.0'
    letterSpacing: 0.05em
spacing:
  base: 8px
  xs: 4px
  sm: 16px
  md: 32px
  lg: 64px
  xl: 128px
  max_width: 1280px
---

## Brand & Style
The design system reflects a "Goldman Sachs of trades" aesthetic: serious, institutional, and rooted in three decades of local authority. The visual language rejects the typical friendly, rounded tropes of modern SaaS for a more rigid, architectural, and archival approach. 

The design style is a hybrid of **Minimalism** and **Brutalism**, characterized by heavy whitespace, high-contrast serif typography, and a strictly rectangular geometry. Every element is designed to feel permanent, stable, and expertly crafted, mirroring the master-level plumbing work provided to the Austin market.

## Colors
The palette is inspired by raw construction materials and historical Austin architecture.
- **Bone (#F0EDE6)**: The primary canvas. Warm and sophisticated, avoiding the clinical nature of pure white.
- **Coal (#1C1C1C)**: Used for high-impact typography to establish an authoritative voice.
- **Rust (#B5451B)**: Reserved strictly for calls to action and critical iconography, representing the industrial core of the business.
- **Pipe (#2B4A6F)**: A deep steel blue used for immersive sections (e.g., footers or contact forms) to provide visual weight and a sense of underground infrastructure.

## Typography
The typographic scale emphasizes hierarchy and editorial clarity. **Playfair Display** provides an intellectual, established feel for headlines. **DM Sans** is the workhorse for body copy, offering a clean, modern balance to the serif headers. **DM Mono** is used for technical specifications, dates, and indexing, reinforcing the "master craft" and technical nature of plumbing diagnostics.

## Layout & Spacing
This design system utilizes an 8px base grid. Layouts are centered with a 1280px maximum width. 

**The Pipe Grid:** A subtle 1px background grid is applied to main sections, featuring "flowing dots" at grid intersections to symbolize fluid movement through structured systems. 

**Structure:**
- **Desktop (1280px+):** 12-column grid, 32px gutters, 64px outer margins.
- **Tablet (768px - 1024px):** 8-column grid, 24px gutters, 32px outer margins.
- **Mobile (<768px):** 4-column grid, 16px gutters, 16px outer margins.

## Elevation & Depth
Depth is created through structural layering rather than shadows. 
- **No Shadows:** Shadows are strictly prohibited to maintain a "blueprint" aesthetic.
- **Tonal Layering:** Surfaces are differentiated by shifting from Bone to Linen background colors.
- **Outlines:** All containers, sections, and interactive elements use a 1px solid border. On light surfaces, use #D4D0C8; on dark surfaces (Pipe Blue), use a 12% white opacity line.

## Shapes
Shape language is strictly rectilinear. All corners are 0px (sharp). This conveys precision, rigidity, and the "standard" of construction. Buttons, input fields, and cards must follow this rule without exception.

## Components
- **Buttons:** Rectangular with 1px solid borders. Primary buttons use the Rust (#B5451B) background with white text. Secondary buttons use a transparent background with a Coal border.
- **Inputs:** 1px Coal border for active states, #D4D0C8 for idle. Text is set in DM Sans 16px.
- **Cards:** Defined by a 1px border. No background fill unless used to highlight a specific service tier, in which case Linen (#E4E0D8) is the standard.
- **Badges/Indices:** Small-caps DM Mono text inside a square 1px border. Used for project years (e.g., "EST. 1994") or technical certifications.
- **Section Dividers:** 1px horizontal lines that extend to the grid edge, creating a structured, architectural blueprint feel across the page flow.