# Последний круг

Пиксельный 2D-детектив по кейсу банка «Центр-инвест»: гонщик погибает на трассе, игрок-детектив ищет убийцу.

Сейчас в репозитории фронтенд-каркас: главная страница, вход и регистрация.

## Запуск

```bash
npm install
npm run dev      # дев-сервер
npm run build    # сборка в dist/
npm run preview  # просмотр собранной версии
npm run lint     # oxlint
```

## Стек

Vite + React 19 + TypeScript, react-router-dom, обычный CSS с токенами в `src/styles/tokens.css`. Пиксельный шрифт — Press Start 2P, текст — Montserrat (оба локально через `@fontsource`).

## Структура

```
src/
  api/        слой запросов: контракт с бэкендом, http-клиент, мок
  auth/       контекст авторизации (AuthProvider, useAuth, RequireAuth)
  components/ переиспользуемые блоки: PageShell, TrackBackdrop, Button, Field, AuthCard
  pages/      HomePage, LoginPage, RegisterPage, IntroPage
  lib/        валидация форм
  styles/     токены и глобальные стили
  routes.ts   пути приложения
```

Маршруты: `/` — главная, `/login` — вход, `/register` — регистрация, `/intro` — заглушка катсцены (только для авторизованных).

## Подключение настоящего бэкенда

Пока `VITE_API_URL` не задан, работает мок в `localStorage` (`src/api/auth.mock.ts`): он повторяет ответы и ошибки будущего API. Как только появится сервер, достаточно положить адрес в `.env`:

```
VITE_API_URL=https://api.example.ru
```

и приложение само переключится на `src/api/auth.http.ts`. Сервер должен отдавать:

| Метод  | Путь             | Тело                      | Ответ                        |
| ------ | ---------------- | ------------------------- | ---------------------------- |
| `POST` | `/auth/register` | `{ nickname, password }`  | `{ token, user }`            |
| `POST` | `/auth/login`    | `{ nickname, password }`  | `{ token, user }`            |
| `GET`  | `/auth/me`       | —                         | `user`                       |
| `POST` | `/auth/logout`   | —                         | `204`                        |

Токен передаётся заголовком `Authorization: Bearer <token>`, формы ответов описаны в `src/api/types.ts`. Ошибки — обычные HTTP-коды с телом `{ "message": "текст для пользователя" }`.

По условию кейса регистрация идёт без почты и телефона — только никнейм и пароль.
