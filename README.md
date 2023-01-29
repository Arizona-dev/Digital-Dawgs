# Digital-Dawgs

## Description
Digital Dawgs is a community driven forum to gather people and informations about diverse topics.
Which includes a live chatting forum between users, a chat to communicate with the adminstrators and a chatbot answers when no admin is available.

## Prerequisites
- make sure you have installed **docker** and **docker-compose**

Create a .env at the root
Add the following lines :

```bash
DATABASE_URL=postgresql://user:password@postgres:5432/digital-dawgs

CLIENT_PORT=3000
FRONT_BASE_URL=http://localhost:3000
VITE_APP_URL=http://localhost:3000

PORT=3001
BACK_BASE_URL=http://localhost:3001
VITE_API_URL=http://localhost:3001

GOOGLE_CLIENT_ID='' // add your google client id
GOOGLE_CLIENT_SECRET='' // add your google client secret

JWT_SECRET=your_secret
```

## Run the app

Using makefile

1. Install dependencies :

```bash
make install
```

2. Migrate the database schemas :

```bash
make migrate
```

3. Load fixtures :

```bash
make fixtures
```

4. Finaly run :

```bash
make start
```

got to http://localhost:3000 for the React app
and http://localhost:8080 for adminer to manage your database.

Next time you want to run the app, just use the following command :

```bash
make start
```

To stop the app, use the following command :

```bash
make stop
```
