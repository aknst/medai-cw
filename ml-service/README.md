# ML Service

## Описание
ML Service - это микросервис для обработки и инференса модели машинного обучения. Сервис является частью системы MedAI и предоставляет REST API для взаимодействия с моделью ML.

## Техническая архитектура

### Стек технологий:
- Python 3.12
- FastAPI - фреймворк для создания API
- PyTorch - библиотека для машинного обучения
- Transformers - библиотека для работы с нейронными сетями
- SQLModel - ORM для работы с SQLite
- Joblib - для сериализации моделей

### Структура проекта:
```
ml-service/
├── app/              # Исходный код приложения
├── pyproject.toml    # Файл конфигурации зависимостей
├── Dockerfile        # Конфигурация Docker
└── README.md         # Документация
```

## Установка и запуск

### Локальный запуск
1. Установите зависимости:
```bash
uv pip install -e .
```

2. Запустите сервис:
```bash
fastapi run app/main.py
```

### Запуск через Docker
1. Соберите Docker образ:
```bash
docker build -t ml-service .
```

2. Запустите контейнер:
```bash
docker run -d -p 3454:8000 ml-service
```

## Интерфейс API
Сервис предоставляет следующие эндпоинты:
- POST /predict - для выполнения предсказаний
- GET /health - проверка состояния сервиса

