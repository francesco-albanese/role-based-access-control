const AccessControl = require('accesscontrol')
const accessControl = new AccessControl()

exports.roles = (() => {
  accessControl.grant('basic')
    .readOwn('profile')
    .updateOwn('profile')

  accessControl.grant('supervisor')
    .extend('basic')
    .readAny('profile')

  accessControl.grant('admin')
    .extend('basic')
    .extend('supervisor')
    .updateAny('profile')
    .deleteAny('profile')

  return accessControl
})()