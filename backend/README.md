# Backend Сервис

## Описание
Backend сервис является основным компонентом системы MedAI, обеспечивающим обработку HTTP-запросов и взаимодействие с другими сервисами. Сервис реализован на FastAPI и предоставляет REST API для фронтенд-приложения.

## Техническая архитектура

### Стек технологий:
- Python 3.10
- FastAPI - фреймворк для создания API
- PostgreSQL - база данных
- SQLModel - ORM для работы с базой данных
- Alembic - система миграций базы данных
- Pydantic - валидация данных
- HTTPX - HTTP клиент
- JWT - аутентификация
- Passlib - хеширование паролей

### Структура проекта:
```
backend/
├── app/              # Исходный код приложения
│   ├── api/         # API маршруты
│   ├── core/        # Основная логика
│   ├── db/          # База данных
│   └── models/      # Модели данных
├── scripts/         # Скрипты
├── pyproject.toml   # Файл конфигурации зависимостей
├── Dockerfile       # Конфигурация Docker
├── alembic.ini      # Конфигурация Alembic
└── README.md        # Документация
```

## Установка и запуск

### Локальный запуск
1. Установите зависимости:
```bash
uv pip install -e .
```

2. Запустите миграции базы данных:
```bash
alembic upgrade head
```

3. Запустите сервис:
```bash
fastapi run app/main.py
```

### Запуск через Docker
1. Соберите Docker образ:
```bash
docker build -t backend .
```

2. Запустите контейнер:
```bash
docker run -d -p 8000:8000 backend
```

## Интерфейс API
Сервис предоставляет следующие основные эндпоинты:

### Аутентификация
- POST /auth/login - аутентификация пользователя
- POST /auth/register - регистрация нового пользователя
- POST /auth/refresh - обновление токена

### Пользователи
- GET /users/me - информация о текущем пользователе
- GET /users/{user_id} - информация о пользователе
- PUT /users/{user_id} - обновление информации пользователя

### Приемы (appointments)
- GET /appointments - список приемов (с фильтрацией и пагинацией)
- GET /appointments/{appointment_id} - информация о приеме
- POST /appointments - создание приема (для пациента и врача)
- PUT /appointments/{appointment_id} - обновление приема
- DELETE /appointments/{appointment_id} - удаление приема

### Инференс
- POST /inference - отправка запроса на предсказание
- GET /inference/health - проверка состояния сервиса инференса

### Приватные роуты
- GET /private - проверка приватного доступа

### Особенности API
- Поддержка JWT аутентификации
- Ролевая система доступа (пациент, врач, администратор)
- Валидация входных данных
- Поддержка пагинации и фильтрации
- Асинхронная обработка запросов
- Интеграция с ML Service для предсказаний

## Особенности
- Поддержка аутентификации и авторизации
- Валидация входных данных с помощью Pydantic
- Интеграция с ML Service для предсказаний
- Автоматическое обновление схемы базы данных

## Требования к окружению
- Python 3.10+
- Docker (для контейнеризации)
- PostgreSQL 16 (для хранения данных)

## Безопасность
- JWT токены для аутентификации
- Хеширование паролей
- Валидация входных данных
- Защищенные HTTP заголовки
