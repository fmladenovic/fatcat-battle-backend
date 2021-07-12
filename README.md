# FatCat battle

Back-end for FatCat Battle project. Based on [NestJS](https://nestjs.com/).

Application is dockerized, it is set up only for development (for now).


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

### Set up node

Set up node / npm version
```bash
$ nvm use
```

### Local environment

Install packages locally
```bash
$ npm ci
```

## Running the app

```bash
# development
$ sudo docker-compose down -v && sudo docker-compose up --build
```

## Database migrations

To initialize database you need to run migration (after app is started)
```bash
$ sudo docker exec -it main bash
$ npm run migrate:all
```

On any entity changes, you need to create new migration (and run it manually)
```bash
$ sudo docker exec -it main bash
$ npm run migrate:create -- -n name_of_migration_camel_cased
```

After creating migration you need to reset ownership on migrations (or seeds) to actually use them
```bash
$ sudo chown user:user src/db/migrations/*
$ sudo chown user:user src/db/seeds/*
```

Where `user` would be your machine username,

To revert (one) migration use
```bash
$ sudo docker exec -it main bash
$ npm run migrate:undo
```

## Database seed (DEVELOPMENT ONLY)

To seed development data, database should already be initialized, migrated and application should be started.

```bas
$ sudo docker exec -it main bash
$ npm run seed:all
```

If seeds need change, you should change it in `db/seeds` (only file), not generate new one, firstly revert current seed, and then update what is necessary and start seed again. To revert current seed do

```bash
$ sudo docker exec -it main bash
$ npm run seed:undo
```
