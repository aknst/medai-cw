# MedAI - Медицинская AI Платформа

## Описание
MedAI - это медицинская платформа, которая использует ИИ для помощи в диагностике и рекомендациях для пациентов. Платформа предоставляет удобный веб-интерфейс для взаимодействия с AI-системой.

## Функциональность

### Для пациентов:
- Запись на приём к врачу
- Ввод симптомов и жалоб
- Отслеживание истории обращений

### Для врачей:
- Просмотр записей пациентов
- Добавление диагнозов и рекомендаций по полученным от пациентов данным
- Интеграция с AI-системой для поддержки диагностики

## Архитектура

### Структура проекта:
```
medai-cw/
├── backend/           # Backend сервис на FastAPI
├── frontend/          # Frontend приложение на Vite
├── ml-service/        # ML сервис для обработки моделей
└── docker-compose.yml # Конфигурация Docker
```

### Система сервисов:
1. **Frontend** (Vite)
   - Веб-интерфейс для взаимодействия с пользователем
   - Реализован на современных фреймворках
   - Порт: 5173

2. **Backend** (FastAPI)
   - REST API для обработки запросов
   - Аутентификация и авторизация
   - Управление приёмами и пользователями
   - Интеграция с ML сервисом

3. **ML Service** (Python)
   - Обработка и предсказания медицинской модели

4. **PostgreSQL** (16)
   - Хранение данных пользователей и приёмов

## Запуск проекта

### Предварительные требования
- Docker и Docker Compose
- Python 3.10+
- Node.js 18+

### Переменные окружения
```
# База данных
POSTGRES_PASSWORD=your_password
POSTGRES_USER=postgres
POSTGRES_DB=medai_db

# ML Service
ML_HOST=http://ml-service:8000

# Backend
SECRET_KEY=your_secret_key
FIRST_SUPERUSER=admin@example.com
FIRST_SUPERUSER_PASSWORD=your_password

# Frontend
VITE_API_URL=http://localhost:8007
```

### Запуск через Docker Compose
1. Соберите и запустите все сервисы:
```bash
docker compose up --build
```

2. После запуска сервисы будут доступны по следующим адресам:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8007
   - ML Service API: http://localhost:3454
   - PostgreSQL: localhost:5444

### Остановка сервисов
```bash
docker compose down
```

## Технологический стек

### Backend
- Python 3.10
- FastAPI
- PostgreSQL
- Alembic
- Pydantic
- JWT
- Passlib

### ML Service
- Python 3.12
- PyTorch
- Transformers
- Joblib

### Frontend
- Vite
- Modern JavaScript/TypeScript
- Modern UI frameworks

## Безопасность
- JWT аутентификация
- Хеширование паролей
- Валидация входных данных
- Защищенные HTTP заголовки
- Ролевая система доступа
- Интеграция с ML сервисом