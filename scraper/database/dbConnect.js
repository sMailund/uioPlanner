/* jshint esversion: 6 */

const pgp = require('pg-promise')();
const db = pgp('postgres://test_user:pleaseIgnroe@localhost:5432/planner');

module.exports = {
  pgp, db
};
