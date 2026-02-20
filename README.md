# E-Commerce

Aplikacja e-commerce zbudowana w Next.js, umożliwiająca przegląd produktów, filtrowanie, zarządzanie koszykiem i ulubionymi, składanie zamówień oraz podgląd historii zamówień.

## Technologie
- Frontend: Next.js 16, React 19, TypeScript
- UI i stylowanie: SCSS, Material UI, Lucide Icons
- Formularze i walidacja: Formik, Yup
- Wizualizacja danych: Recharts
- Dane aplikacji: lokalny plik JSON + LocalStorage

## Wymagania
- Node.js 18+
- npm 9+

## Uruchomienie

### 1) Instalacja zależności
```bash
npm install
```

### 2) Start środowiska developerskiego
```bash
npm run dev
```

Aplikacja będzie dostępna pod: http://localhost:3000

### 3) Build produkcyjny
```bash
npm run build
npm run start
```


## Dane i przechowywanie
- Katalog produktów oraz kategorii jest zdefiniowany w `src/data.json`.
- Dane użytkownika, koszyk, ulubione, szczegóły zamówienia i historia zamówień są zapisywane w LocalStorage przeglądarki.

## Funkcje
- Rejestracja użytkownika i podstawowe zarządzanie kontem
- Przegląd produktów z wyszukiwarką, filtrowaniem i kategoriami
- Koszyk zakupowy z modyfikacją ilości produktów
- Lista ulubionych produktów
- Proces zamówienia (dostawa, adres, płatność, podsumowanie)
- Historia zamówień na koncie użytkownika
- Panel administratora z podglądem i wyszukiwaniem zamówień (rola `admin`)

## Uwagi
- Aplikacja nie wymaga osobnego backendu — działa na danych lokalnych.
- Aby uzyskać rolę administratora, podczas rejestracji ustaw nazwę użytkownika na `admin`.
- Wyczyść LocalStorage, jeśli chcesz zresetować stan aplikacji (konto, koszyk, zamówienia).
