describe('HealthController', function () {
  describe('GET /knockknock => .check', function () {
    it('should return 200 OK', async function () {
      // this would create a record.
      let res = await server().get('/knockknock');

      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(res.body).to.eql({ success: true });

      // this path should go in update
      res = await server().get('/knockknock');

      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(res.body).to.eql({ success: true });
    });
  });

  describe('GET / => .status', function () {
    it('should respond with 200 OK', async function () {
      let res = await server().get('/');

      expect(res.statusCode).to.equal(200);
      expect(res.body).to.have.keys('load', 'mem', 'uptime', 'version');
      expect(res.body.load).to.be.an('array');
      expect(res.body.mem).to.be.a('number');
      expect(res.body.uptime).to.be.a('number');
      expect(res.body.version).to.be.a('string');
    });
  });

  describe('read only health', function () {
    beforeEach(function () {
      app.config.readonly = true;
    });

    afterEach(function () {
      app.config.readonly = false;
    });

    it('should return 200 OK, /knockknock', async function () {
      // this would create a record.
      let res = await server().get('/knockknock');

      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(res.body).to.eql({ success: true });

      res = await server().get('/knockknock');

      expect(res.statusCode).to.equal(200);
      expect(res.headers['content-type']).to.equal('application/json; charset=utf-8');
      expect(res.body).to.eql({ success: true });
    });
  });
});
