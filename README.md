# Smart Accountant System

## Development

```bash
npm install && npm run dev
```

or

```bash
yarn && yarn dev
```

## Test API

0. Run development
1. Import the following JSON into `SAS-service-dev` > `users`:

```JSON
{
    "_id" : ObjectId("5cdee0d85626682a64b4fbcb"),
    "isRemoved" : false,
    "username" : "thor",
    "password" : "$2a$10$nABLGjTf.G0kYKoSHbv2auexa.8u4jcqqTvpzDtMob3EA9u0Dsr9i",
    "fullname" : "duke thor",
    "phone" : "1234567890",
    "createdAt" : ISODate("2019-05-17T16:27:04.946+0000"),
    "updatedAt" : ISODate("2019-05-17T16:27:04.946+0000"),
    "__v" : NumberInt(0)
}
```

2. Import `SAS.postman_collection.json` to Postman
3. Use `(username, password) = (quang, 123456)` to login & get token
4. Feel free to test API & remember to update `SAS.postman_collection.json`

## Requires

- NodeJS
- Postman
- Yarn (optional)
