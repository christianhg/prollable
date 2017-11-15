# prollable

[![npm module](https://badge.fury.io/js/prollable.svg)](https://www.npmjs.org/package/prollable)
[![Dependencies](https://david-dm.org/christianhg/prollable.svg)](https://david-dm.org/christianhg/prollable)

Promises are great since they encourage error handling and compose easily. Why not use them as wrappers for synchronous code too? `prollable` exposes some convenient functions for composing nullables and conditions using Promises.

`Promise<¯\_(ツ)_/¯>`

## Example

### Intro

Let's say we are building passwordless authentication. The user writes their email address in a form field and if the address is known, they get a JWT sent to their inbox.

In our application we got a function, `signJwt`, that takes an Email and returns a Promise of a JWT:

```js
// Email → Promise<JWT>
function signJwt(email) { ... }
```

We also got an array of known emails:

```js
const emails = [
  'foo@example.com',
  'bar@example.com'
]
```

Now we are gonna create a function, `authorize`, that takes a Request, extracts the Email from the Request body, validates the Email, and uses `signJwt` to sign the JWT.

```js
// Request → Promise<JWT>
function authorize(req) { ... }
```

### Before

A traditional approach could look something like this:

```js
// Request → Promise<JWT>
function authorize(req) {
  if (!req.body.email) {
    return Promise.reject('Email missing')
  }

  if (!emails.includes(req.body.email)) {
    return Promise.reject('Unknown email')
  }

  return signJwt(req.body.email)
}
```

### After

Using `prollable` we can easily convert the nullables and conditions to Promises and let the data flow through a chain instead:

```js
const { fromCondition, fromNullable } = require('prollable')

// Request → Promise<JWT>
function authorize(req) {
  return fromNullable(req.body.email, 'Email missing')
    .then(email => fromCondition(emails.includes(email), email, 'Unknown email'))
    .then(signJwt)
}
```

You can even go one step further and abstract each Promise to its own function to allow a more point-free style:

```js
// Request → Promise<Email>
const getEmail = req => fromNullable(req.body.email, 'Email missing')

// Email → Promise<Email>
const validateEmail = email =>
  fromCondition(emails.includes(email), email, 'Unknown email')

// Request → Promise<JWT>
const authorize = req =>
  getEmail(req)
    .then(validateEmail)
    .then(signJwt)
```

It's important to note that `prollable` is just as much about the idea of using Promises more extensively for (propagated) error handling. It's completely possible to reach the same chainable result using the Promise constructor inside the `onFulfilled` callback of `.then`:

```js
// Request → Promise<JWT>
function authorize(req) {
  return new Promise(
    (resolve, reject) =>
      reg.body.email ? resolve(req.body.email) : reject('Email missing')
  )
    .then(
      email =>
        new Promise(
          (resolve, reject) =>
            emails.includes(email) ? resolve(email) : reject('Unknown email')
        )
    )
    .then(signJwt)
}
```

## API

### `prollable.fromCondition(..)`

* **Arguments:**
    - `condition`
    - `resolveTo`
    - `rejectTo`

* **Returns:** *Promise*

* **Example:**

    ```js
    const persons = [
      { age: '30', name: 'Bob' },
      { name: 'Alice' }
    ]

    const bobPromises = persons
      .map(person => fromCondition(person.name === 'Bob', person, 'Person not named Bob'))
    ```

### `prollable.fromNullable(..)`

* **Arguments:**
    - `nullable`
    - `rejectTo`

* **Returns:** *Promise*

* **Example:**

    ```js
    const persons = [
      { age: '30', name: 'Bob' },
      { name: 'Alice' }
    ]

    const agePromises = persons
      .map(person => fromNullable(person.age, 'Age missing'))
    ```
