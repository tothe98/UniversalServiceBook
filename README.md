# Univerzális szervizkönvy
## Előfeltételek
##### __Node és NPM verzió__
* NPM: v8.19.2
* Node: v18.12.0

##### __Adatbázis__
MongoDB adatbázis szerver, ahol a `test` adatbázisban  léteznie kell az alábbi gyüjteményeknek adatokkal feltöltve:
- VehicleTypes
- Manufactures
- Models
- Fuels
- DriveTypes
- DesignTypes
- Transmissions

##### __`.env` fájl létrehozása a server/config mappába__
- `PORT="8080"`
- `JWT_SECRET="[EGYEDI_BIZTONSÁGI_KÓD]"`
- `MONGODB="[MONGODB_ADATBÁZIS_URL]"`
- `EMAIL="[EMAIL_CÍM]"`
- `EMAIL_PASSWORD="[EMAIL_JELSZÓ]"`
- `CLIENT_URL="[KLIENS_URL]"`

(A server/config mappán belül az example fájl létezik)
## Telepítés és Indítás
#### Backend
A Terminálban a `cd server` parancssal lépjen be a szerver mappába és ott a `npm install` parancssal telepítse fel a csomagokat.
A szerver mappán belül a `npm run start` parancssal tudja futtatni a backend-et.
#### Frontend
A Terminálban a `cd client` parancssal lépjen be a kliens mappába és ott a `npm install` parancssal telepítse fel a csomagokat.
A kliens mappán belül a `npm run start` parancssal tudja futtatni a frontend-et.
