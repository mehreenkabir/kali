# Kalïanïa Portfolio - Aether AI Architect Directives

## Project Context & Core Philosophy
This is the personal portfolio of Kalïanïa, architected as a multi-world digital sanctuary. It is an immersive experience, not a website. The core philosophy is to create digital spaces that are a direct reflection of a unique, multifaceted soul. The brand archetype is the **Ethereal Sovereign**: a gentle, powerful guide with profound, unshakeable wisdom. Every line of code and every design choice must serve this archetype.

## The Three Worlds: A Triptych of Experiences
The portfolio is built upon three distinct, self-contained "worlds," each with its own unique aesthetic, interactive model, and emotional resonance.

-   **ART**: The world of co-creative artistry.
-   **MATH**: The world of playful, gamified order.
-   **YOGA**: The world of ethereal, spiritual connection.

---

## World 1: The YOGA Sanctuary (`/yoga`, `/subscribe`)
### The Ethereal Grotto
-   **Feeling:** A "unicorn ride across a rainbow." Soft, pastel, stunning, and magical, like stepping into a gentle waterfall. It is a space of pure, welcoming, feminine energy.
-   **Aesthetic:**
    -   **Background:** The `pastel-dream-gradient` (animated pink, blue, yellow) is the foundation.
    -   **Typography:** The primary voice is `font-dreamy` (`Caveat`), a soft, handwritten script. This is contrasted with an elegant `font-serif` (`Cormorant Garamond`) for brand names and CTAs.
    -   **UI:** Translucent "glassmorphism" cards (`backdrop-blur`), soft glows, and shimmering gold (`aurora-border`) accents.
-   **User Journey:**
    1.  **`/yoga` (The Invitation):** A single, full-screen page featuring a poetic mission statement. Its sole purpose is to resonate emotionally and lead to the subscription portal.
    2.  **`/subscribe` (The Unveiling):** A horizontal "tarot spread" of three interactive, 3D-tilting cards that unveil the subscription offerings. This is the sacred entrance to the archives.

## World 2: The MATH Odyssey (`/math`, `/math/world-map`, `/math/pricing`)
### The 8-Bit Adventure
-   **Feeling:** Nostalgic, joyful, and empowering. It reframes a complex subject as a fun, engaging quest.
-   **Aesthetic:**
    -   **Visuals:** Classic 8-bit pixel art.
    -   **Color Palette:** Vibrant, high-contrast primary colors (`mario-blue`, `mario-red`, `luigi-green`).
    -   **Typography:** The primary font is `font-pixel` (`Press Start 2P`).
    -   **UI:** Blocky, tactile buttons with hard pixel shadows.
-   **User Journey:**
    1.  **`/math` (The Start Screen):** An immersive, full-screen entry point with a single, blinking "PRESS START" button.
    2.  **`/math/world-map` (The World Map):** An interactive map presenting services as explorable destinations.
    3.  **`/math/pricing` (The Power-Up Shop):** A gamified pricing page where subscription tiers are presented as items to "ACQUIRE," "EQUIP," or "POWER UP!"

## World 3: The ART Sanctuary (`/art`, `/contact`)
### The Living Canvas
-   **Feeling:** "A big kiss on the internet." Intimate, mysterious, and deeply interactive. The user is not a spectator; they are a co-creator.
-   **Aesthetic:**
    -   **Visuals:** A dark, atmospheric space. The portfolio itself is a hidden, full-screen collage of vibrant images.
    -   **Core Interaction:** An innovative "spotlight" mask effect. The user's cursor becomes a soft light, "painting" away a dark overlay to reveal the art beneath.
    -   **Color Palette:** A deep, soulful dark (`atelier-dark`) as the canvas, with the revealed art providing the color.
-   **User Journey:**
    1.  **`/art` (The Living Canvas):** The entire page is an interactive art piece. The only focal point is a central, poetic invitation to collaborate.
    2.  **`/contact` (The Sanctuary Gates):** A seamless transition to an elegant Login/Sign Up portal that maintains the ethereal, dream-like atmosphere of the art page. This is the exclusive gatekeeper for all collaborations.

---

## Global Technical & Design Standards

-   **Framework**: Next.js 15+ (App Router).
-   **Language**: TypeScript. All code must be strongly typed.
-   **Styling**: Tailwind CSS. All custom colors and fonts must be defined in `tailwind.config.ts`.
-   **Configuration**: The project must have a valid `postcss.config.mjs` to correctly process Tailwind directives like `@apply`.
-   **Global Components**:
    -   **`Header.tsx`**: Must be "theme-aware," accepting a `theme` prop (`'light' | 'dark'`) to adapt its colors.
    -   **`GlobalFooter.tsx`**: Must also be "theme-aware" to ensure visibility on all backgrounds.
-   **Homepage (`/`)**: Must be the "Triptych Portal" layout, serving as the grand entrance to the three worlds. It does **not** use the global `Header`.
-   **Code Sanitation**: The codebase must be kept lean and purposeful. Any unused components, styles, or assets from previous design iterations must be deleted.