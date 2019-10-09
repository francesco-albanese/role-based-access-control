# Role based access control node app!

This is an example Node.js application to test permissions and protected routes.

The roles are defined using the npm package [accesscontrol]([https://www.npmjs.com/package/accesscontrol](https://www.npmjs.com/package/accesscontrol))
and the app is running on an express server using mongodb to store users.

To login and signup users I am using jsonwebtoken and passwords are hashed using bcrypt.

# How to run the app

- install the dependencies using npm or yarn
- add a .env file at the root of the project with a `JWT_SECRET` variable
- make sure you are running a local instance of mongodb pointing to `mongodb://localhost:27017/rbac`
- run `npm start` in your terminal

## Todo

```
- [x] add unit tests for User model
- [ ] add unit tests for controllers
- [ ] add unit tests for middlewares
- [ ] add typescript
```