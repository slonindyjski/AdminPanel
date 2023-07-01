# Panel administratora

Panel służy do zarządzania stronami na platformie [PythonAnywhere](https://www.pythonanywhere.com/).

---

## Funkcje panelu
- Proste zarządzanie (np. włączanie i wyłączanie stron, ustawianie hasła)
- Przeglądarka logów: dostępowych, błędów i serwera

## Planowane funkcje
- Aktualizowanie stron
- Statystyki wejść i zapytań
- Zarządzanie zabezpieczeniami

---

## Uruchamianie panelu
1. Do uruchomienia panelu wymagany jest Python w wersji 3 oraz MySQL.
2. Sklonuj kod panelu oraz przejdź do folderu, do którego został on sklonowany.
```bash
git clone https://github.com/barteklorenc/AdminPanel.git
cd AdminPanel
```
3. Zainstaluj wymagane biblioteki Python.
```bash
pip install -r requirements.txt
```
4. Utwórz bazę danych oraz tabele MySQL.
```sql
CREATE DATABASE AdminPanel;
USE AdminPanel;
CREATE TABLE users (
    id int NOT NULL AUTO_INCREMENT,
    username varchar(255) NOT NULL,
    full_name varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    secret_2fa varchar(255),
    PRIMARY KEY (id)
);
CREATE TABLE websites (
    id int NOT NULL AUTO_INCREMENT,
    user_id int NOT NULL,
    name varchar(255) NOT NULL,
    domain varchar(255) NOT NULL,
    pythonanywhere_host varchar(255) NOT NULL,
    pythonanywhere_username varchar(255) NOT NULL,
    pythonanywhere_api_token varchar(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (id) REFERENCES users(id)
);
```
5. Dodaj użytkownika. Podaj hasło zahashowane w formie SHA256.
```sql
INSERT INTO users VALUES (NULL, "username", "full_name", "password", "email", NULL);
```
6. Dodaj konfigurację do pliku `configs.json`. Przykładowa konfiguracja jest dostępna w pliku `example_configs.json`.
7. Uruchom plik `app.py`.
- Windows
```bash
py app.py
```
- Linux
```bash
python3 app.py
```
