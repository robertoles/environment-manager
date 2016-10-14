/**
 * @typedef {Object} S3Location
 * @property {string} endpoint
 * @property {string} Bucket
 * @property {string} Key
 * @property {string|undefined} VersionId
 */

'use strict';

const AWS = require('aws-sdk');
const _ = require('lodash');

/**
 * Parse a string as an S3 object URL.
 * @param {string} url - the URL that refers to the S3 object.
 * @returns {S3Location|undefined} The parsed S3 location.
 */
function parse(url) {
  let regex = /^(https:\/\/s3[^\/\.]+\.amazonaws\.com)\/([^\/]+)\/([^\?]+)(?:\?versionId=([^&]+))?$/;
  let t = regex.exec(url);
  if (t === null) {
    return undefined;
  }
  return {
    endpoint: t[1],
    Bucket: t[2],
    Key: t[3],
    VersionId: t[4],
  };
}

/**
 * Get the object at the S3 URL.
 * @param {string} url - the URL that refers to the S3 object.
 * @param {Object} options - additional options to the AWS.S3 constructor.
 * @returns {ReadableStream} A readable stream of the object data.
 */
function getObject(url, options) {
  let params = parse(url);
  if (params === undefined) {
    throw new Error(`The URL is not a valid S3 object or object version URL: ${url}`);
  }
  let opts = Object.assign({}, options || {}, params.endpoint);
  let getObjectArgs = Object.assign({}, _(params).pick('Bucket', 'Key', 'VersionId').omitBy(_.isUndefined));
  return new AWS.S3(opts).getObject(getObjectArgs).createReadStream();
}

module.exports = {
  getObject,
  parse,
};
