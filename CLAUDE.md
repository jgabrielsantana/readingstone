# CLAUDE.md

Orientações para o Claude Code (claude.ai/code) ao trabalhar neste repositório.
- Antes de mexer em texto ou visual, leia `PRODUCT.md` e `DESIGN.md`.
- Verificar, com o site servido (ver README): `node ~/.claude/skills/design-taste-frontend/scripts/{lint,inspect}.mjs <arquivos|url>` e `~/.claude/plugins/cache/impeccable/impeccable/*/skills/impeccable/scripts/impeccable.cmd detect http://localhost:5173/`; esperado 0 FAIL. As skills ficam fora do git; reinstale com `npx skills add Leonxlnx/taste-skill` e o plugin impeccable.
- Títulos `h1`/`h2` cabem em 2 linhas (artigos com menos de ~50 caracteres), texto corrido a partir de 16px, e o texto evita travessões; `lint` e `inspect` reclamam se não.
- Git: o e-mail do autor é o noreply do GitHub, nunca o pessoal.
