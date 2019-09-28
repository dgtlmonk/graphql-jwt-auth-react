# Server for GraphQL JWT Authentication lab

Requirements

- docker
- node stable 12.^

Setup `postgres` via `docker`

`$ docker pull postgres:alpine`

Run docker with mounted volume

`docker run --name jwt-auth -e POSTGRESS_PASSWORD=somebody -d -p 5432:5432 -v jwt-auth:/var/lib/postgresql/main postgres:alpine`

Create database

`docker exec -it jwt-auth psql -U postgres -c "create database jwt_auth;"`

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

Browse GraphQL Apollo Server at http://localhost:4000/graphql
