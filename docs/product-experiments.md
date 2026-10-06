# Product experiments — movieMatcher (React Native)

Журнал **мобильного** клиента. Канон правил матча (пороги, фазы, WS-контракты) — в backend:

`../movie-match/docs/product-experiments.md`

Web (Angular): `../../dashboard-movie-match/docs/product-experiments.md`

Перед правками Match/Rooms — Cursor rule `match-rooms-product-context`.

---

## Уже на backend (mobile получает без UI)

| ID | Что | Mobile impact |
|----|-----|----------------|
| **A** | shortlist порог **4** (было 8) | работает сразу через API |
| **B** (API/WS) | `commonUpdated` + поля в room `state` | UI подписан (B-mobile shipped) |

---

## Backlog

### C / H

См. backend journal (escape hatch, invite).

---

## Shipped (mobile-specific)

### L-mobile — Sync языка UI → backend JWT / catalog (2026-10-06)

- **Status:** shipped
- **Hypothesis:** без `PATCH /auth/language` и `language` на login/Google комнаты и catalog остаются на старом `user.language` / JWT `lang` (часто `ru`), даже если UI уже на `en`
- **Change:**
  - `PATCH /auth/language` из профиля (`up-language`) + сохранение нового JWT
  - login / Google: body `language` из AsyncStorage
  - `/user/me`: profile `language` → local i18n (source of truth после auth)
  - `shared/utils/user-language.ts` (normalize parity with backend)
  - fix: `loadMovieName` читал `currentLanguage`, писали в `language`
- **Parity ref:** `dashboard-movie-match` → `AuthService.updateLanguage` + login/Google `language`
- **Note:** first launch без сохранённого языка берёт device locale (`RNLocalize`); неизвестный код → **`en`**. Backend `DEFAULT_USER_LANGUAGE` / column default тоже **`en`**. После auth — `/user/me`.
- **Metric:** доля сессий с JWT `lang` == UI language; `catalogLanguage` новых комнат
- **Result:** —
### B-mobile — Live «Общих: N» в RN (2026-10-06)

- **Status:** shipped
- **Hypothesis:** тот же прогресс, что на вебе; иначе эксперимент B неполный
- **Change:**
  - `match-socketService`: subscribe `commonUpdated`
  - hydrate из room state (`commonCount`, `commonMovies`, `commonTargetCount`)
  - UI на swipe/waiting (`match-selection-movie`): бейдж `Общих: N` / `N / 4` в SET; список title; toast на первое общее
  - i18n rules: «8 совпадений» → «4»
- **Parity ref:** `dashboard-movie-match` → `MatchPlaySessionService` + `match-lobby-play`
- **Metric:** как у B на backend
- **Result:** —
