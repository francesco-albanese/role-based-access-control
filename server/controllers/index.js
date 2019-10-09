const {
  signup,
  login,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  grantAccess,
  allowIfLoggedin
} = require('./userController')

module.exports = {
  signup,
  login,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  grantAccess,
  allowIfLoggedin
}