#!/bin/bash

# Цвета для логов
BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Функция для вывода логов с цветами и префиксами
log_frontend() {
    echo -e "${GREEN}[FRONTEND]${NC} $1"
}

log_backend() {
    echo -e "${PURPLE}[BACKEND]${NC} $1"
}

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Проверка concurrently
if ! command -v concurrently &> /dev/null; then
    log_info "Установка concurrently..."
    npm install -g concurrently
fi

log_info "🚀 Запуск MedBook Frontend & Backend..."
echo ""
log_info "Backend: http://localhost:8000"
log_info "Frontend: http://localhost:3000"
echo ""
log_info "Нажмите Ctrl+C для остановки"
echo ""
echo "==============================================="
echo ""

# Запуск обоих процессов с префиксами
concurrently --names "BACKEND,FRONTEND" \
    --prefix-colors "purple,green" \
    --prefix "[{name}]" \
    --prefix-length 10 \
    "php artisan serve --host=0.0.0.0 --port=8000" \
    "cd frontend && npm run dev"