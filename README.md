# NestJs Stripe Integration

This is an example of integration with stripe to create and manage your subscriptions,
just in your backend. This api provides the links and redirects you to where you need it.

## Tech

Libraries:

- Stripe
- class-transformer
- class-validator

## Instalation

You will need of [Node.js](https://nodejs.org/) v16 or up.

Install the dependencies and devDependencies and start the server.

```sh
yarn
yarn start:dev
```

## Routes

To create a new subscription:

```sh
curl --request POST \
  --url http://localhost:3000/payment \
  --header 'Content-Type: application/json' \
  --data '{
	"email":"YOUR_EMAIL",
	"priceId": "SOME_PRICE_ID"
}'
```

When a subscription is successful:

```sh
curl --request GET \
  --url 'http://localhost:3000/payment/success?success=true&session_id={SESSION_ID}'
```

When a subscription is canceled:

```sh
curl --request GET \
  --url 'http://localhost:3000/payment/canceled?canceled=true'
```

To generate and redirect the user to the Portal in order to manage their charges:

```sh
curl --request POST \
  --url http://localhost:3000/payment/portal \
  --header 'Content-Type: application/json' \
  --data '{
	"sessionId": "SESSION_ID"
}'
```

## License

MIT
**Thiago Novato - tnovato.com**
