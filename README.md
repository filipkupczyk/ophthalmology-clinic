 Ophthalmology Clinic Backend

Backend aplikacji do zarządzania kliniką okulistyczną.  
Projekt realizowany w Spring Boot z wykorzystaniem JWT oraz Spring Security.

Frontend aplikacji znajduje się w trakcie budowy.
Funkcjonalność została zaimplementowana, warstwa UI/UX zostanie dopracowana w kolejnych iteracjach.

---

## Technologie

- Java 17+
- Spring Boot
- Spring Data JPA
- Spring Security
- JWT (JSON Web Token)
- Hibernate
- MySQL
- Maven
- Angular 21
- TypeScript
- Bootstrap
---

## Funkcjonalności

- Rejestracja użytkowników
- Logowanie użytkowników (JWT)
- Role i uprawnienia (ADMIN, DOCTOR, PATIENT)
- Zarządzanie użytkownikami
- Zarządzanie lekarzami
- Tworzenie i edycja wizyt
- Autoryzacja endpointów na podstawie JWT
- Relacje encji:
  - Appointment → Doctor
  - Appointment → User (pacjent)

---

## Role i uprawnienia

W systemie zaimplementowane są role:

- `ADMIN`
- `DOCTOR`
- `PATIENT`
- `SECRETARY`

Role przechowywane są w encji `User` i wykorzystywane przez Spring Security
do kontroli dostępu do endpointów. Admin może edytować oraz dodawać lekarzy wizyty oraz użytkowników. Doctor ma wgląd tylko w wizyty umówione do niego oraz ma możliwość ich edycji. Patient ma możliwość edycji oraz stworzenia/usunięcia tylko swoich wizyt. Secretary ma kontrole nad wszystkimi wizytami w serwisie.

---

## Modele danych

### User
Reprezentuje użytkownika systemu.

Pola:
- id
- firstName
- lastName
- email
- password (szyfrowane BCrypt)
- role

---

### Doctor
Reprezentuje lekarza.

Pola:
- id
- firstName
- lastName
- active

---

### Appointment
Reprezentuje wizytę.

Pola:
- id
- doctor
- user (pacjent)
- dateTime
- active

---

## Baza danych

Aplikacja korzysta z MySQL.  
Tabele tworzone są automatycznie przez Hibernate.

## Bezpieczeństwo

- Autoryzacja oparta o JWT
- Hasła szyfrowane przy użyciu BCryptPasswordEncoder
Endpointy:
- /auth/** – publiczne (logowanie)
- pozostałe – wymagają tokena JWT
- Token JWT przekazywany w nagłówku:
- Authorization: Bearer <TOKEN>

## Status projektu

Backend: gotowy działający i przetestowany
Frontend: funkcjonalność aplikacji została zaimplementowana

## Planowany rozwój:
- Przeprojektowanie interfejsu użytkownika
- Responsywność
- Dodatkowe animacje i UX improvements

## Autor:
Filip Kupczyk
