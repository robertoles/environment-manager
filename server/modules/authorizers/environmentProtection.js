/**
 * Created by duncanh on 12/10/16.
 */
'use strict';

let co = require('co');
let configCache = require('modules/configurationCache');

const SCHEDULE_ENVIRONMENT = 'SCHEDULE_ENVIRONMENT';

function getEnvironmentType(environmentName) {
  return co(function* () {
    let environment = yield configCache.getEnvironmentByName(environmentName);
    return configCache.getEnvironmentTypeByName(environment.EnvironmentType);
  });
}

function* isActionProtected(environmentName, action) {
  let envType = yield getEnvironmentType(environmentName);
  let protectedActions = envType.ProtectedActions || [];
  return protectedActions.indexOf(action) !== -1;
}

module.exports = {
  SCHEDULE_ENVIRONMENT,
  isActionProtected: co.wrap(isActionProtected)
};
