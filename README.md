# Jantar Pré-Casamento — Rafaella & Johnatan

Site premium de convite para o jantar pré-casamento de Rafaella & Johnatan.

## Evento

- **Data:** 10 de Abril de 2026 (Sexta-feira)
- **Horário:** 21h15 (recepção a partir das 21h)
- **Local:** Restaurante Cheio de Graça · Belo Horizonte
- **Bebidas:** Não inclusas
- **PIX:** johnatangoontijo@gmail.com

## Estrutura

```
jantar-pre-casamento/
├── index.html              # Página principal
├── src/
│   ├── css/
│   │   ├── tokens.css      # Design tokens (cores, tipografia, espaçamento)
│   │   ├── main.css        # Reset, cursor, header, botões
│   │   ├── hero.css        # Seção hero com parallax
│   │   ├── sections.css    # Cards de info, restaurante, CTA
│   │   ├── gallery.css     # Grid de galeria
│   │   ├── modal.css       # Modal de confirmação (3 steps)
│   │   └── footer.css      # Rodapé
│   └── js/
│       ├── main.js         # Cursor, header scroll, triggers do modal
│       ├── animations.js   # GSAP + ScrollTrigger
│       └── modal.js        # Lógica do modal (PIX → Form → Sucesso)
├── assets/
│   ├── images/
│   │   ├── hero.jpg        # Imagem de fundo do hero
│   │   ├── restaurant.jpg  # Foto do restaurante
│   │   ├── gallery-1.jpg   # Fotos do casal (1–6)
│   │   └── ...
│   └── logos/
│       └── logo-dourado.png
└── README.md
```

## Como usar

Abra o `index.html` diretamente no navegador ou sirva com qualquer servidor HTTP estático.

### Adicionar imagens

Coloque as imagens na pasta `assets/images/`:

| Arquivo           | Descrição                        | Tamanho recomendado |
|-------------------|----------------------------------|---------------------|
| `hero.jpg`        | Fundo do hero (foto do casal)    | 1920×1080px         |
| `restaurant.jpg`  | Foto do restaurante              | 800×1000px          |
| `gallery-1.jpg`   | Foto do casal #1                 | 800×600px           |
| `gallery-2.jpg`   | Foto do casal #2                 | 800×600px           |
| `gallery-3.jpg`   | Foto do casal #3                 | 800×600px           |
| `gallery-4.jpg`   | Foto do casal #4                 | 800×600px           |
| `gallery-5.jpg`   | Foto do casal #5                 | 800×600px           |
| `gallery-6.jpg`   | Foto do casal #6                 | 800×600px           |

### Logo dos noivos

Coloque em `assets/logos/logo-dourado.png`. Se não houver arquivo, o fallback exibe "R & J" em tipografia Cormorant Garamond.

## Dependências externas (CDN)

- **GSAP 3.12.5** — animações e ScrollTrigger
- **Google Fonts** — Cormorant Garamond + Montserrat

## Fluxo do modal

1. **PIX** — Exibe a chave PIX com botão copiar
2. **Formulário** — Nome, telefone, número de convidados
3. **Sucesso** — Confirmação com animação

## Personalização futura

Para integrar envio real de formulário (ex: Supabase, Formspree, EmailJS), edite a função `form.addEventListener('submit', ...)` em `src/js/modal.js`.
