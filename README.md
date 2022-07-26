# Tyba BE Engineer Test REST API

by Julian Bermudez Valderrama

## Description

This is my solution proposal for the Tyba BE Engineer Test. More details regarding the test and its requirements can be found on the test document previously shared.

## Getting started

### Pre-requisistes

Install the previous tools for the appropriate execution of the project:

- NodeJS (or nvm)
- Docker
- pgAdmin or any other DB client (for executing scripts on `./db/scripts` and managing data with ease).

### Dependencies

Install the project dependencies via npm with the command:

`npm i`

Run the app running the command:

1. Run `docker-compose up -d` for deploying service containers: DB, and app.
2. On pgAdmin, create the connection with the database credentials and options set on the `./.env` file.
3. Run the DB scripts that are located in `./db/scripts` on pgAdmin (or any other DB client compatible with PostgreSQL)
   - Run `./db/scripts/create-schema.sql`
   - Run `./db/scripts/tables-datafill.sql`

> **Note:** For dropping the schema or deleting the values on the tables, you can find the respective script on the `./db/scripts/drop-schema.sql` file.

The app should be up and running after the command execution.

### Testing

#### e2e tests

For running the e2e tests, which expose some API tests considered for the project, execute the command:

> `npm run test:e2e`

## Context

### API design

The API routes are defined below:

- `/v1/auth/register (POST):` Endpoint for registering a new user.

  - Body:

    ```javascript
    {
      "email": string,
      "firstName": string,
      "password": string
    }
    ```

- `/v1/auth/login (POST):` Endpoint to log-in a user on the API.

  - Body:

    ```javascript
    {
      "email": string,
      "password": string
    }
    ```

- `/v1/auth/logout (POST):` Endpoint to login-out a user on the API.

  - Headers:

    ```javascript
    {
      "Authorization": "Bearer ${token-goes-here}"
    }
    ```

- `/v1/users/:id/transactions (GET):` Endpoint for getting the transactions history from an user.

  - Params:

    ```javascript
    {
      "id": number,
    }
    ```

  - Headers:

    ```javascript
    {
      "Authorization": "Bearer ${token-goes-here}"
    }
    ```

- `/v1/places (GET):` Endpoint for getting the transactions history from a user.

  - Query params:

    ```javascript
    {
      "categories": string, // coma-separeted categories (ex.: 'restaurants')
      "latlong": string, // coma-separated latitude & longitude (ex.: '4.6575715,-74.1122502')
    }
    ```

  - Headers:

    ```javascript
    {
      "Authorization": "Bearer ${token-goes-here}"
    }
    ```

### Database

#### Scripts

The database definition and data-fill SQL scripts can be found on the `./db/scripts` folder.

#### Entities-Relations design

The Entities-Relations definition is described below by the image:

![er-diagram](https://user-images.githubusercontent.com/13318483/180932398-52e6a19a-2ef2-4611-837b-ecf275e5dbd7.png)

As shown in the image, the database schema is composed of the following entities:

- `users:`

  - Columns definition:

    ```javascript
    {
      id serial NOT NULL,
      email varchar(80) NOT NULL,
      first_name varchar(250) NOT NULL,
      PRIMARY KEY (email)
    }
    ```

- `users_auth:`

  - Columns definition:

    ```javascript
      {
        user_email varchar(80) NOT NULL,
        password varchar(250) NOT NULL,
        PRIMARY KEY (user_email)
      }
    ```

- `users_tokens:`

  - Columns definition:

    ```javascript
      {
        user_email varchar(80) NOT NULL,
        token varchar NOT NULL,
        valid boolean NOT NULL DEFAULT true,
        PRIMARY KEY (user_email)
      }
    ```

- `transactions:`

  - Columns definition:

    ```javascript
      {
        id serial NOT NULL,
        user_email varchar(80) NOT NULL,
        value varchar(250) NOT NULL,
        PRIMARY KEY (id)
      }
    ```

> **Note:** The foreign keys definition can be found on the `./db/scripts/create-schema.sql` script, but they were not included for simplicity and consistencies-issues avoidance.

### About external data providers

#### Data provider

The data provider chosen for the `restaurants` requirement was [FourSquare](https://developer.foursquare.com/) via [Places Search API](https://developer.foursquare.com/reference/place-search). I chose this provider keeping in mind the following aspects:

- Simple to use and set up (creating a developer account, creating API keys).
- Provides a powerful search feature that can be defined and filtered by relevant criteria, such as categories (ex.: 'restaurants'), latitude & longitude (ex.: 'lat,long').
- Has a good base of places and locations data resources around the globe.

#### Implementation

I want to mention some special points about the external data provider service implementation (via FourSquare) since I consider that the work done allows me to introduce important concepts when managing such kinds of data providers.

I decided to implement an additional layer to access and request nearby restaurants data with FourSquare on behalf of:

- `Standard API entry-point:`

Providing a standard entry-point to the FourSquare API is useful because it can be re-used depending on future use-cases.

Such implementation can be found on the `./providers/apis/foursquare_api/foursquare.gateway.ts` file. The `request` function is a normalized process that depends on the use-case provider that takes the API metadata and its args, then it shapes the requests with those parameters.

- `Use-case-based requests`:

For the `nearby restaurants` use case, the provider in charge of fulfilling such request is the `./providers/apis/foursquare_api/places_search/places_search.provider.ts` file. This file handles the specific logic for consuming the Places Search API via the FourSqureGateway class.

Now, if in the future arises the need to add more API use-cases, they will be defined similarly to the `places_search.provider.ts` file. This introduces maintainability on how the providers will be managed for future use-cases.

### Framework

The REST API was designed using [NestJS](https://docs.nestjs.com/):

> Nest (NestJS) is a framework for building efficient, scalable Node.js server-side applications. It uses progressive JavaScript, is built with and fully supports TypeScript (yet still enables developers to code in pure JavaScript), and combines elements of OOP (Object Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

Personally, I find this framework as one of my favorite frameworks to define backend services, because the capabilities that NestJS provides are focused on a well-defined project structure, and also introduce techniques like dependency injection that are desirable in a continuously growing project.

## Additional considerations

### Secrets

As a security measure, secrets are stored outside the app execution environment. The secret definition can be defined on a `./.env` file at the root of the project.

An examaple about how a `./.env` file might be defined is located on the `./.env.exmaple` file.

### API docs

The API implements Swagger as visual API documentation that can be used from the following URL on any web browser `http://localhost:3000/v1/docs`.
