#!/bin/bash
# =========================================================
# deploy.sh — Brinka Mais Festas
# Executar no servidor: bash /var/www/brinkamaisfestas/deploy/deploy.sh
# =========================================================
set -e

REPO="https://github.com/LeonardoGMendoza/brinkamaisfestas.git"
APP_DIR="/var/www/brinkamaisfestas"
DEPLOY_DIR="/var/www/brinkamaisfestas-build"

echo ""
echo "🎉 =================================================="
echo "   Deploy - Brinka Mais Festas"
echo "   $(date)"
echo "=================================================="

# Instalar Node se necessário
if ! command -v node &> /dev/null; then
  echo "📦 Instalando Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi

# Clonar ou atualizar repositório
if [ -d "$DEPLOY_DIR/.git" ]; then
  echo ""
  echo "🔄 Atualizando código do GitHub..."
  cd $DEPLOY_DIR
  git pull origin main
else
  echo ""
  echo "📥 Clonando repositório do GitHub..."
  git clone $REPO $DEPLOY_DIR
  cd $DEPLOY_DIR
fi

# Instalar dependências e buildar
echo ""
echo "📦 Instalando dependências..."
npm install --production=false

echo ""
echo "🔨 Fazendo build..."
npm run build

# Copiar build para pasta do Nginx
echo ""
echo "📁 Publicando arquivos..."
mkdir -p $APP_DIR
cp -r $DEPLOY_DIR/dist/* $APP_DIR/
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR

echo ""
echo "✅ =================================================="
echo "   Deploy concluído!"
echo "   🌐 https://brinkamaisfestas.sandlj.com.br"
echo "=================================================="
