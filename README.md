# JekkiJaneArt

Многостраничный сайт-портфолио/коммерции художницы на Next.js (App Router) с подготовленной архитектурой для дальнейшего расширения.

## Требования

- Node.js 20
- npm 10+ (или совместимый)

## Установка

```bash
npm install
```

## Локальная разработка

```bash
npm run dev
```

Откройте `http://localhost:3000`.

## Сборка

```bash
npm run build
npm run start
```

## Деплой на Netlify 

- Проект совместим с стандартным деплоем Next.js App Router на Netlify.
- Выберите репозиторий в Netlify, команда сборки: `npm run build`.
- Версия Node: 20 (указать в настройках Netlify Environment / Build).

## Структура папок 

```text
src/
  app/                 # маршруты и общий layout
  components/
    layout/
    modals/
    nav/
    sections/
  data/                # manifests и seed-данные
  lib/                 # утилиты
  styles/              # дополнительные стили (резерв)
```
