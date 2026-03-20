# Findings — Portfolio Audit Completo

## ✅ Implementado

### Arquitetura / DX
- [x] `useTilt` duplicado em Work + Services → extraído para `hooks/useTilt.ts` (genérico com T extends HTMLElement)
- [x] `const E` duplicado em 7 componentes → extraído para `lib/easing.ts`
- [x] `SectionLabel` repetido em 5 seções → extraído para `components/ui/SectionLabel.tsx`
- [x] `Loader` importado 2x (layout.tsx + page.tsx) → removido do page.tsx

### SEO & Metadata
- [x] `openGraph` completo (title, description, image, locale, type)
- [x] `twitter` card (summary_large_image)
- [x] `metadataBase` definido
- [x] `robots` (index/follow + googleBot params)
- [x] `sitemap.xml` gerado via `app/sitemap.ts`
- [x] `robots.txt` gerado via `app/robots.ts`
- [x] JSON-LD Person schema (name, jobTitle, sameAs, knowsAbout)
- [x] `lang="pt-BR"` corrigido (era "pt")
- [x] `icons` metadata completo (favicon, apple-touch-icon, PWA icons)
- [x] `manifest` link na metadata
- [x] `theme-color` definido

### PWA
- [x] `/public/manifest.json` criado (name, short_name, icons, theme_color, display: standalone)

### Acessibilidade
- [x] Skip-to-content link (`#main-content`) no layout
- [x] `id="main-content"` no `<main>` de page.tsx
- [x] Work cards: `div onClick` → `motion.a` com `href`, `target`, `rel`, `aria-label`
- [x] Work SmallCards: mesmo fix
- [x] ConsoleWindow: adicionado `role="log"` + `aria-label`
- [x] Stat numbers (About): adicionado `aria-label` com valor + label completo
- [x] Focus-visible styles no globals.css (outline violet 2px)
- [x] `.sr-only` utility adicionada ao globals.css

### Build
- [x] Build Next.js sem erros — todos os 6 routes estáticos OK
- [x] TypeScript sem erros
- [x] `/robots.txt` e `/sitemap.xml` gerados estaticamente

## ⏳ Pendente (requer assets visuais)
- [ ] `/public/og-image.png` (1200×630) — gerar com muapi-nano-banana ou Figma
- [ ] `/public/apple-touch-icon.png` (180×180)
- [ ] `/public/icon-192.png` e `/public/icon-512.png` para PWA
- [ ] URL real do portfolio (substituir `devfecavalieri.com` pelo domínio real)
- [ ] Email no Contact section (atualmente só telefone/LinkedIn/GitHub)
