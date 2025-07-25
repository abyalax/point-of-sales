<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  A progressive
  <a href="http://nodejs.org" target="_blank">Node.js</a>
  framework for building efficient and scalable server-side applications.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
</p>

## Description

[Nest](https://github.com/nestjs/nest) Boilerplate Backend Typescript.

## Project setup

```bash
pnpm install
```

## Compile and run the project

Development

```bash
pnpm run start
```

Watch mode

```bash
pnpm run start:dev
```

Production mode

```bash
pnpm run start:prod
```

## Run tests

Unit Test

```bash
pnpm run test
```

e2e tests

```bash
pnpm run test:e2e
```

Test coverage

```bash
pnpm run test:cov
```

## Nest Script

Generate Full Module CRUD Entity

```bash
nest g res entity
```

This will generate full modul entity, example entity user

```
└── 📁user
    └── 📁dto
        ├── create-user.dto.ts
        ├── update-user.dto.ts
    ├── user.controller.spec.ts
    ├── user.controller.ts
    ├── user.entity.ts
    ├── user.module.ts
    ├── user.service.spec.ts
    └── user.service.ts
```

## Script Custom

Command TypeORM

```bash
pnpm orm
```

Generate Migration from Entity

```bash
pnpm migrate:generate
```

Create New Empty Migrationn

```bash
pnpm migrate:create
```

Run Migration

```bash
pnpm migrate:run
```

Run Seeder

```bash
pnpm seed
```

## Stay in touch

- Author - [Abya Lacks](https://profile-abya.vercel.app/)
- Linkedin - [abyalax](https://www.linkedin.com/in/abyalax/)
- Instagram - [abya.xc](https://www.instagram.com/abya.xc)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
