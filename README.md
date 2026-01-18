# 🍷 Piwniczka - Basement Manager

Aplikacja do zarządzania domowymi trunkami (wino, piwo, cydr, nalewki). Umożliwia śledzenie przepisów, składników oraz aktualnie fermentujących produktów.

## 📋 Funkcjonalności

- **Zarządzanie trunkami** - dodawanie, przeglądanie i usuwanie trunków z datą nastawienia
- **Baza przepisów** - tworzenie przepisów z krokami i składnikami
- **Baza składników** - zarządzanie dostępnymi składnikami
- **Filtrowanie po typie** - piwo, wino, cydr, nalewki
- **Responsywny design** - działa na komputerze i urządzeniach mobilnych

## 🛠️ Technologie

**Backend:**
- Node.js + Express.js 5.x
- MongoDB + Mongoose 9.x
- express-validator (walidacja danych)

**Frontend:**
- Vanilla JavaScript (ES6 Modules)
- HTML5 + CSS3
- Architektura Singleton

## 🚀 Instalacja

1. **Sklonuj repozytorium:**
   ```bash
   git clone https://github.com/greg00ry/BasementManager.git
   cd BasementManager
   ```

2. **Zainstaluj zależności:**
   ```bash
   npm install
   ```

3. **Uruchom MongoDB** (lokalnie lub przez MongoDB Atlas)

4. **Uruchom serwer:**
   ```bash
   npm start
   ```
   lub w trybie deweloperskim:
   ```bash
   npx nodemon server.js
   ```

5. **Otwórz przeglądarkę:** `http://localhost:3000`

## 📁 Struktura projektu

```
Piwniczka/
├── controllers/
│   └── BasementController.js    # Kontroler API
├── models/
│   ├── basement.model.js        # Model piwniczki
│   ├── ingriedient.model.js     # Model składnika
│   ├── recipe.model.js          # Model przepisu
│   └── set.model.js             # Model trunku
├── static/
│   ├── app.js                   # Główny moduł (Singleton)
│   ├── addDrink.js              # Dodawanie trunków
│   ├── addRecipe.js             # Dodawanie przepisów
│   ├── drinks.js                # Lista trunków
│   ├── recipies.js              # Lista przepisów
│   ├── ingrBase.js              # Baza składników
│   ├── home.js                  # Strona główna
│   ├── index.html               # HTML
│   └── style.css                # Style CSS
├── util/
│   └── serverHelper.js          # Helpery serwera
├── server.js                    # Serwer Express
└── package.json
```

## 🔌 API Endpoints

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/sets` | Pobierz wszystkie trunki |
| POST | `/api/sets` | Dodaj nowy trunek |
| DELETE | `/api/sets/:id` | Usuń trunek |
| GET | `/api/recipes` | Pobierz wszystkie przepisy |
| POST | `/api/recipes` | Dodaj nowy przepis |
| DELETE | `/api/recipes/:id` | Usuń przepis |
| GET | `/api/ingriedients` | Pobierz wszystkie składniki |
| POST | `/api/ingriedients` | Dodaj nowy składnik |
| DELETE | `/api/ingriedients/:id` | Usuń składnik |

## 🎨 Screenshot

*Coming soon...*

## 📝 TODO

- [ ] Kalkulator zawartości alkoholu
- [ ] Profile smakowe ukończonych trunków
- [ ] Przypomnienia o końcu fermentacji
- [ ] Statystyki na stronie głównej
- [ ] Eksport/import danych

## 👤 Autor

**Grzegorz Trzaskoma** - [greg00ry](https://github.com/greg00ry)

## 📄 Licencja

Ten projekt jest licencjonowany na warunkach licencji MIT.
