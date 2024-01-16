const chai = require('chai'),
  request = require('supertest'),
  fs = require('fs'),
  nock = require('nock'),
  schemaQuery = fs.readFileSync('./schemas/db/social-media-analyzer-service', 'utf-8'),
  assert = require('assert');

// eslint-disable-next-line no-process-env
process.env.APP_ENV = 'test';

let createQueries,
  concatQuery,
  truncationQuery = 'SET FOREIGN_KEY_CHECKS=0;';

before(function () {
  return new Promise(async (resolve, reject) => {
    const dbConfig = require('../../config/env/test').datastores,
      dbName = dbConfig.database;

    // Removing app cache which loads fastify server
    delete require.cache[require.resolve('../../app')];

    // Reloading fastify server
    await require('../../app')();

    // make a global app function to send request
    global.server = function () {
      return request(global.app.fastify.server);
    };
    // only allow nock to connect on local ip address
    nock.disableNetConnect();
    nock.enableNetConnect('127.0.0.1');
    global.nock = nock;

    global.expect = chai.expect;

    createQueries = `CREATE DATABASE IF NOT EXISTS ${dbName}; USE ${dbName}; `;
    createQueries += schemaQuery;
    concatQuery = `SELECT CONCAT("TRUNCATE TABLE \`", TABLE_NAME, "\`;")
      AS query FROM INFORMATION_SCHEMA.TABLES
      WHERE table_schema IN ("${dbName}");`;

    try {
      await global.app.sequelize.query(createQueries);

      let res = await global.app.sequelize.query(concatQuery);

      res[0].forEach((q) => { truncationQuery += q.query; });
      truncationQuery += 'SET FOREIGN_KEY_CHECKS=1;';
      // await bootstrap();

      resolve();
    } catch (err) {
      console.error(err);
      reject(err);
    }
  });
});

afterEach(function () {
  // cleaning nock after running each test
  global.nock.cleanAll();


  return new Promise(async (resolve, reject) => {
    try {
      await global.app.sequelize.query(truncationQuery);
      resolve();
    } catch (err) {
      reject(err);
    }
  });
});

describe('test-runner', function () {
  it('should have exposed the required globals', function () {
    if (typeof expect === 'undefined') {
      throw new Error('integration _bootstrap has not globalized chai.expect');
    }

    if (typeof server === 'undefined') {
      throw new Error('integration _bootstrap has not globalized `app` function to lift server');
    }
  });

  it('should lift the service', async function () {
    let res = await server().get('/');

    expect(res.statusCode).to.equal(200);
    expect(res.body).to.have.keys('load', 'mem', 'uptime', 'version');
    expect(res.body.load).to.be.an('array');
    expect(res.body.mem).to.be.a('number');
    expect(res.body.uptime).to.be.a('number');
    expect(res.body.version).to.be.a('string');
  });
});

after(function () {
  global.app.fastify.close();
  delete global.app;
  delete global.expect;

  // enabling all disabled net connect
  nock.enableNetConnect();
  delete global.nock;
});
