# Seller Role — выбор роли при регистрации

## Суть задачи

При регистрации пользователь выбирает кто он:
- **Покупатель** → после входа попадает на `/dashboard`
- **Продавец** → после входа попадает на `/seller`

Admin остаётся захардкожен (`admin@kitapall.kz` + пароль), через форму не регистрируется.

---

## Что меняется в коде

### 1. `types/index.ts`
```
Role: 'client' | 'admin'
→ Role: 'client' | 'admin' | 'seller'
```

Добавить интерфейсы `SellerProduct` и `SellerStats` (см. ниже в разделе стора).

---

### 2. `AuthPage.tsx` — форма регистрации

Только в режиме `register` — добавить переключатель роли между `client` и `seller`.

**Новый state:**
```ts
const [role, setRole] = useState<'client' | 'seller'>('client');
```

**UI — два таба над формой (только при register):**
```
┌─────────────────────────────────┐
│  [ Покупатель ]  [ Продавец ]   │  ← таб-переключатель
│                                 │
│  Имя                            │
│  Email                          │
│  Пароль                         │
│                                 │
│  [ Зарегистрироваться ]         │
└─────────────────────────────────┘
```

Активный таб — красный фон `bg-[#F14635] text-white`.
Неактивный — серый `bg-gray-100 text-gray-500`.

**Логика `handleSubmit` при register:**
```
если role === 'seller' → login(email, 'seller', name) → navigate('/seller')
если role === 'client' → login(email, 'client', name) → navigate('/dashboard')
```

При переключении на `login` — роль сбрасывается, таб не показывается.

---

### 3. `useAuthStore.ts`

В функции `login` добавить ветку для seller:

```
balance:
  admin  → 500_000
  seller → 320_000
  client → 150_000
```

---

### 4. `ProtectedRoute.tsx`

Сейчас принимает `allowedRole?: 'admin' | 'client'` — одну строку.

Изменить на массив:
```ts
allowedRoles?: Role[]
```

Редирект по роли:
```
admin  → /admin
seller → /seller
client → /dashboard
```

Обновить все места использования в `routes.tsx`:
```
allowedRole="admin"  →  allowedRoles={['admin']}
```

---

### 5. `routes.tsx` — новый блок для seller

```
/seller              → SellerDashboard  (protected, role: seller)
/seller/products     → SellerProducts
/seller/orders       → SellerOrders
/seller/analytics    → SellerAnalytics
```

Seller живёт внутри `SellerLayout` (свой сайдбар, без общего Header).

---

### 6. Новые файлы

```
src/
├── store/
│   └── useSellerStore.ts          ← стор с мок-данными продавца
└── features/
    └── seller/
        ├── SellerLayout.tsx       ← сайдбар + <Outlet />
        ├── SellerDashboard.tsx    ← главная: цифры, график, заказы
        ├── SellerProducts.tsx     ← таблица товаров вкл/выкл/удалить
        ├── SellerOrders.tsx       ← лента новых заказов
        └── SellerAnalytics.tsx    ← детальные графики
```

---

## Визуальный стиль

- Kaspi-стиль: белый фон, серые разделители, никаких теней и градиентов
- Данные на первом месте
- SellerLayout — отдельный от основного сайта (как Admin, только чище)

---

## Главный экран `/seller`

```
┌──────────────┬──────────────────────────────────────────┐
│              │  Обзор                                   │
│  Обзор       │                                          │
│  Товары      │  [Выручка]  [Заказы]  [Товары]  [Рейтинг]│
│  Заказы      │                                          │
│  Аналитика   │  ───────── График выручки ─────────────  │
│              │                                          │
│  [Выйти]     │  ───────── Новые заказы (лента) ───────  │
│              │                                          │
│              │  ───────── Мои товары (таблица) ───────  │
└──────────────┴──────────────────────────────────────────┘
```

---

## Порядок реализации

1. `types/index.ts` — добавить `'seller'`, новые интерфейсы
2. `useAuthStore.ts` — ветка seller в login
3. `AuthPage.tsx` — таб-переключатель роли при регистрации
4. `ProtectedRoute.tsx` — рефакторинг на `allowedRoles[]`
5. `routes.tsx` — обновить admin-роут, добавить seller-роуты
6. `useSellerStore.ts` — создать с мок-данными
7. `SellerLayout.tsx` — сайдбар
8. Страницы — Dashboard → Products → Orders → Analytics

---

## Подводные камни

- После смены `allowedRole` → `allowedRoles` — проверь ВСЕ места использования `ProtectedRoute` в routes.tsx, иначе сломается доступ к admin
- При регистрации seller — сбрасывай таб роли при переключении на login, иначе можно залогиниться как seller через форму входа
- `SellerLayout` должен рендерить `<Outlet />` — без этого вложенные роуты не покажутся
