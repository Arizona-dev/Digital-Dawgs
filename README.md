# Digital-Dawgs

## Description
Digital Dawgs is a community driven forum to gather people and informations about diverse topics.
Which includes a live chatting forum between users, a chat to communicate with the adminstrators and a chatbot answers when no admin is available.

## Prerequisites
- make sure you have installed **docker** and **docker-compose**

Create a .env at the root
Add the following lines :

```bash
APP_ENV=dev
JWT_PASSPHRASE=your_secret
PORT=3000
CLIENT_PORT=3001

DATABASE_URL=postgres://user:password@postgres:5432/digital-dawgs
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
