# Vessyl Blueprint design contract

## Direction

A photographic editorial journey: generous but content-related intervals, aligned paired collections, quiet material surfaces and controlled transitions. The visual identity belongs to Vessyl; the reference articles supply a method, not replacement colors, fonts or marketing copy.

## System ownership

1. `lib/approved-copy.json`, `lib/locales`, `lib/classic-photography.json`, `lib/header-theme.ts`: approved content, media and canvas authority.
2. `app/blueprint-tokens.css`: semantic dimensions, material and motion tokens.
3. `app/classic-spacing.css`: adjacency rules and photo bridges; Blueprint remaps the scale without duplicating section boundaries.
4. `app/blueprint.css`: shared Blueprint component/composition rules. `app/blueprint-cinematic.css`: second-iteration materials and photographic chapters, imported last.
5. `app/blueprint-motion.css` and `BlueprintMotion.tsx`: progressive entrances and shared state motion.

Inherited Classic files retain exact editorial/media contracts. Do not append page-specific patches to `globals.css`; extend an existing role in the Blueprint layer.

## Roles

| Role                 | Composition and spacing                                                                                                            |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Photographic opening | Full-width photo; centered copy; header uses its shared gradient. Portrait openings and Sessions preserve tested crops.            |
| Utility opening      | Content-sized Press/Contact/FAQ, without viewport-height filler.                                                                   |
| Prose                | Centered, 680px prose measure; heading/body gap 28px.                                                                              |
| Photographic story   | Two-column grid, shared 32–96px gap; source-aspect photography; alternate desktop stories and stack on mobile.                     |
| Collection           | Experience in aligned pairs, 4:3 photography; practice cards share image/title/body spacing and filter states.                     |
| Accent surface       | Forest Two Doors, copper quotation, neutral fans for Experience facilitators; internal insets own boundaries.                      |
| Film/gallery         | Preserve 80%/95% films, 10px corners and interactive behavior. Elevation is restricted to photographic layers and floating panels. |
| Photo bridge         | Existing deliberate overlap 32–64px with positive copy clearance; never slide a photograph over a film.                            |
| Divider              | Straight 2px copper gradient, with its own air.                                                                                    |

Closed spacing scale: 8, 16, 24, 32, 48, 64, 96, 128px. The approved 28px copy gap, 4px control and 10px photograph radii are intentional brand-specific exceptions. Section insets vary fluidly from 64 to 128px; photograph overlaps retain their established range. At widths up to 560px, headings, prose and ordinary photography share a single 16px content gutter. Headings wrap inside their container; never expand them independently to viewport width. Framed collection cards extend to 8px, then use a 1px border plus 7px inner inset so image, label, heading and prose return to the same 16px line. Films retain their separate 95% width contract. The supported mobile minimum is 360px; 375px is also a required design/QA target (user decision, 2026-09-10). Earlier 320px results are historical stress checks, not the current design baseline.

## Motion

Signature curve `cubic-bezier(.16,1,.3,1)`, no bounce. Response 160ms, control 240ms, panel 420ms, page 480ms, one-time editorial reveal 800ms, exit 180ms. Collection stagger is 70ms within each pair, never an accumulating delay down the page.

- Interactive changes use interruptible transitions and static selected/focus cues.
- Semantic content groups enter once; no letter-by-letter prose, repeating scroll animations or content hidden before hydration.
- Desktop scenic opening photos move by at most 24px, with modest overscan; portrait/Sessions/Dome crops are excluded. Reduced motion, smaller screens and constrained devices skip the scene effect.
- Keyboard focus reveals pending content immediately. New filter content cannot remain hidden. Observer/listener/animation cleanup is mandatory.
- Video state icons cross-fade without visible technical text or new controls. Functional audio/playback behavior remains identical for all four films.
- Existing measured accordion/filter height transitions remain an intentional usability exception to the motion article's blanket layout-animation ban.

## Applied references

- [The Design System Blueprint](https://copper-astronaut-40f.notion.site/The-Design-System-Blueprint-396b0fd1c010816c8314c86209b3d48d): grids, material roles, bounded scales, component states, shared signature motion, documentation.
- [15 Golden Skills](https://copper-astronaut-40f.notion.site/My-15-Golden-Skills-for-Motion-3b5b0fd1c01081118f0cd2a9fc92e0cb): relevant design-system, interface polish and motion principles.
- [make-interfaces-feel-better](https://github.com/jakubkrehel/make-interfaces-feel-better/tree/main/skills/make-interfaces-feel-better): concentric controls, optical sizing, interruptible transitions, hit areas, image depth, icon state continuity, explicit transition properties.
- [ECC motion skills](https://github.com/affaan-m/ECC/tree/main/skills/motion-foundations): SSR/reduced-motion/device gates and token-based motion; patterns/advanced inform entrances, cleanup and preservation of gallery gestures.

The motion/react recipes are adapted to the existing CSS, browser View Transitions and DOM observer implementation. No animation framework was installed solely for these effects. Blueprint's generic blue palette, pill buttons and example fonts, spring recipes, continuous decoration and paid/research-only integrations were intentionally omitted. Author-specific values are not universal standards.

## Cinematic iteration — 2026-09-09

- **Glass navigation:** navigation, Booking, App and language share a 48px control height, capsule corners, one-pixel outline and common glass surface; Booking uses the primary filled treatment. The Experience panel spans the full viewport width with 24px rounded corners, with large photo cards and an independent Overview link. A globe popover and inset mobile sheet retain their own content layouts. Desktop navigation switches at 1320px to accommodate both locales. Desktop actions follow Book a Stay, Download App, then the language selector in both visual and keyboard order. The adapted Arkkhe material uses Vessyl paper/forest, a restrained highlight, blur and a solid fallback. Photo/menu cards underline only their labels; Overview stays a separate link. Keyboard traversal follows the visual hierarchy.
- **Collections:** Experience photo frames, frosted practice cards and travel/app information panels share a 24px outer radius, one-pixel edge and bounded elevation. Photographs retain 10px corners and CTAs retain 4px corners. Small-screen Experience, practice and travel/app panels extend to 8px from the viewport; every inner content type aligns at 16px, not just headings.
- **Dome chapter:** original Figma exterior and interior layers cross-fade with chapter-local scroll, next to the approved opening and Audio/Video/Vibro-Tactile tabs. This is photographic 2.5D, not a reconstructed architectural model. Mobile, windows at most 600px high and reduced-motion visitors receive a compact stacked static interior. The hidden exterior does not download in these layouts. The remaining desktop stage equals the viewport height without a fixed minimum. Native scrolling, semantic text, no-JavaScript content and observer cleanup remain intact. Optimized derivatives total approximately 474 KiB; no additional runtime dependency.
- **Home Founder bridge:** a full-width section owns viewport gutters once. Two equal columns from 1001px retain a large portrait and single-line CTA; at 1000px and below the portrait and 680px prose stack. Preserve the 10px radius and overlap with the preceding surface.
- **Founder:** the approved portrait remains alongside the biography while scrolling on desktop. Mobile uses the same reading order in a single column; short desktop windows disable portrait pinning. Both dividers, every approved paragraph, press marks and the standardized film remain present.
- **Nature and Stay:** a wide rainforest image creates a pause between alternating stories; the room photograph receives more width without changing the carousel controls or accommodation copy.
- **Two Doors:** restored the approved lightweight Classic composition after user review on 2026-09-10: one forest pattern surface, open text columns and two actions. No individual glass cards or duplicate logo panels. Home and Experience retain their original closing photograph and approved closing text in the adjacent closing-signature section.

[Cinematic Websites with AI](https://copper-astronaut-40f.notion.site/Kit-Cinematic-Websites-with-AI-392b0fd1c01081fb8ad6c388b81ce4b3) informed the chapter structure, spatial layers, sticky editorial story and photographic rhythm. [From Figma to Live Website](https://copper-astronaut-40f.notion.site/Course-From-Figma-to-Live-Website-with-Claude-s-MCP-392b0fd1c01081c1b139d6f30aa3aa67) informed source inspection and iterative browser verification. The [Arkkhe reference](https://www.figma.com/design/e8Uyom3mAupZnMY5V392qb/Daily-Hero-42----Arkkhe--Copy-?node-id=4030-2) supplied menu/card surface construction, inspected through live MCP. These references do not replace Vessyl's copy or visual identity.

## Responsive component contracts

- The Dome interior uses an 800px / 94,700-byte derivative on narrow screens when pixel density allows; larger screens and high-density phones retain the 1060px original. Responsive preload and image candidates must agree so only one interior is downloaded. The desktop photographic layers remain approximately 474 KiB combined.
- Ordinary story photos use their source aspect ratio. Fixed crops belong only to named hero/portrait/scenic compositions. Preserve faces and the existing registry positions.
- Collection heading/action rows wrap before squeezing an action into a narrow column.
- Mobile quotes use Telugu MN word outlines at 29px; their container is the available content width. Desktop quotation artwork remains unchanged.
- Paragraph-to-action and Room Concept heading-to-body intervals are 28px. Accordion headings carry no extra outside margin; the trigger owns row padding.
- Desktop header groups share 48px height, capsule corners (radius equals half the height) and one-pixel outlines; the mobile menu icon is geometrically centered with zero asymmetric padding. The full-width Experience panel retains 24px rounded corners. These header roles are separate from the 4px content-CTA radius; unifying heights must not square off the rounded navigation (user correction, 2026-09-10).

## Acceptance

Validate both languages, 17 routes, header-canvas parity, mobile heading gutters, logical collection order (Dome third), film behavior, dropdown/keyboard focus, filters/dialogs, gallery gestures and reduced-motion behavior. The original repository must remain at its recorded baseline and clean. Deployment must target only the independent Blueprint repository and URL.
