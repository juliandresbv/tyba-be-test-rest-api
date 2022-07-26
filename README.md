# Tyba BE Engineer Test REST API

by Julian Bermudez Valderrama

## Description

This is my solution proposal of the Tyba BE Engineer Test. More details regards the test and its requirements can be found on the test document previously shared.

## Getting started

### Pre-requisistes

Install the previous tools for the apprpriate execution of the project:

- NodeJS (or nvm)
- Docker
- pgAdmin or any other DB client (for executing scripts on `./db/scripts` and managing data with ease).

### Dependencies

Install the project dependencies with the command:

> npm i

Run the app following the next steps:

1. `docker-compose up -d` (for deploying service containers: db, app).

The app should be up and running after the command execution.

## Context

### API design

### Entities-Relations design

### About external data providers

#### Data provider chosen

The data provider chosen for the `restaurants` requirement was [FourSquare](https://developer.foursquare.com/) via [Places Search API](https://developer.foursquare.com/reference/place-search). I chose this provider keeping in mind the following aspects:

- Simple to use and set-up (creating developer account, creating API keys).
- Provides a powerful search feature that can be defined and filtered by relevant criteria, such as categories (ex.: 'restaurants'), latitude & longitude (ex.: 'lat,long').
- Has a good base of places and locations data resources around the globe.

#### Implementation

I want to mention some special points about the external data provider service implmentation (via FourSquare), since I consider that the work done allows me to introduce important concepts when managing such kind of data providers.
I decided to implement an additional layer to access and request nearby restaurants data with FourSquare on behalf of:

- Providing an standard entry-point to the FourSquare API that can be re-used depending on future use-cases. Such implementation can be found on the `./providers/foursquare.gateway.ts` file. The API request function is a normalized process that depends on the use-case provider that invokes the gateway.
- Abstracting and hiding the use and consume of the FourSquare API.

### Framework

The REST API was designed using NestJS, a powerful backend framework that focuses on providing out-of-the-box tools and libraries that allows the developer
