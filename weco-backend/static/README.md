# Static Files

Эта директория содержит статические файлы для FastAPI приложения.

## Структура

- `boxes/` - изображения eco-боксов
  - `box1.jpg` - фото для BOX-001 (Mall Eco Box)  
  - `box2.jpg` - фото для BOX-002 (Park Eco Station)
  - `box3.jpg` - фото для BOX-003 (University Eco Point)

## Использование

Файлы доступны по URL: `http://localhost:8000/static/...`

Например: `http://localhost:8000/static/boxes/box1.jpg`

## Замена заглушек

Текущие `.jpg` файлы - это текстовые заглушки. Замените их на настоящие изображения в формате JPG/PNG для production использования.