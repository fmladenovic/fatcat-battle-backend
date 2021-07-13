# FatCat battle

Back-end for FatCat Battle project. Based on [NestJS](https://nestjs.com/).

Application is dockerized, it is set up only for development.

### Set up database

First we need to set up docker database volume:

```bash
$ sudo docker volume create fatcat-battle-dbdata
```

After setting up volume, database initialization is necessary as well

Start up database container:

```bash
$ sudo docker-compose run db
```

Connect to database container:

```bash
$ sudo docker exec -it db bash
```

Log in with credentials from .env (made easier for you)

```bash
$ mysql -u fatcat_battle -ppassword
```

And run:

```sql
CREATE DATABASE `fatcat-battle`;
```

### Local environment

Install packages locally

```bash
$ npm ci
```

## Running the app

```bash
$ sudo docker-compose down -v && sudo docker-compose up --build
```

## Database migrations

To initialize database you need to run migration

```bash
$ sudo docker exec -it main bash
$ npm run migrate:all
```

## Database seed

To seed development data, database should already be initialized, migrated and application should be started.

```bas
$ sudo docker exec -it main bash
$ npm run seed:all
```
