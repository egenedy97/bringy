# Bringy

### Starting Project

```
docker-compose build
docker-compose up

```

### Project Architecture

```
 src/
    controllers/
        auth.controller.ts
        contact.controller.ts
    database/
        index.ts
    exceptions/
        HttpException.ts
    interfaces/
        auth.interface.ts
        routes.interface.ts
        user.interface.ts
    middlewares/
        auth.middleware.ts
    models/
        contact.model.ts
        user.model.ts
    routes/
        auth.route.ts
        contact.route.ts
        user.route.ts
    service/
        auth.service.ts
        contact.service.ts
        users.service.ts
    tests/
        auth.controller.test.ts
        auth.service.test.ts
        contact.service.test.ts
    app.ts
    server.ts
```

### Adv Features .

- you can filter with any values you want and makeing sorting with any field with a little code .

- I used OOP concept with allow me to organize code in an easy way.
