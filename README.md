# 🎉 Brinka Mais Festas

Site de aluguel de brinquedos e artigos para festas.

## Tecnologia

- **React 19** + **Vite**
- **CSS puro** com glassmorphism e dark mode
- 4 áreas: Site Público, Admin, Atendente e Cliente
- 100% responsivo (mobile-first)

## Estrutura do Projeto

```
brinkamaisfestas/
├── src/
│   ├── App.jsx        # Componente principal + todas as telas
│   ├── main.jsx       # Entry point React
│   └── index.css      # Design system completo
├── public/
├── index.html
├── package.json
└── vite.config.js
```

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse: http://localhost:5173

## Credenciais de Demo

| Usuário | Senha | Área |
|---|---|---|
| `admin` | `festa123` | Painel Admin |
| `atendente` | `brinka2026` | Área Atendente |
| Qualquer cadastro | ≥6 chars | Área Cliente |

## Deploy

```bash
# Build para produção
npm run build

# Os arquivos ficam em: dist/
```

## Servidor

- **URL:** https://brinkamaisfestas.sandlj.com.br
- **Servidor:** Ubuntu 24.04 — 187.77.32.137
- **Web Server:** Nginx
- **SSL:** Let's Encrypt (Certbot)
