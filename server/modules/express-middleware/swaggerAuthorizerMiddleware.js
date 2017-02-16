/* Copyright (c) Trainline Limited, 2016-2017. All rights reserved. See LICENSE.txt in the project root for license information. */

'use strict';

let _ = require('lodash');
let authorization = require('modules/authorization');

function authorize(req, res, next) {
  if (req.swagger === undefined) {
    next();
    return;
  }

  let authorizerName = req.swagger.operation['x-authorizer'] || 'simple';
  let authorizer = require(`modules/authorizers/${authorizerName}`);

  // We need to rewrite this for authorizers to work with swagger
  // TODO(filip): remove this once we move to v1 API and drop old one
  _.each(req.swagger.params, (param, key) => {
    req.params[key] = param.value;
  });

  if (req.url !== '/token' && req.url !== '/login' && req.url !== '/logout') {
    authorization(authorizer, req, res, next);
  } else {
    next();
  }
}

module.exports = () => authorize;
