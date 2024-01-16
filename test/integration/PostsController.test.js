const chai = require('chai');
const chaiHttp = require('chai-http');
const { expect } = chai;

chai.use(chaiHttp);

const PostsRepository = require('../../api/repository/PostsRepository');

describe('PostsController', () => {
  describe('createPosts', () => {
    it('should create a new post', async () => {
      let res = await server()
        .post('/api/v1/posts')
        .send({ uniqueIdentifier: 'abc123', text: 'This is a test post' });

      expect(res.status).to.equal(200);
    });

    it('should return error if duplicate unique identifier is passed', async () => {
      let res = await server()
        .post('/api/v1/posts')
        .send({ uniqueIdentifier: 'abc123', text: 'This is a test post' });

      expect(res.status).to.equal(500);
    });
  });

  describe('findByUniqueIdentifier', () => {
    it('should return a post', async () => {
      beforeEach(async () => {
        await PostsRepository.createPosts({
          uniqueIdentifier: 'abc123',
          wordCount: 5,
          averageWordLength: 3,
          createdAt: Date.now(),
          updatedAt: Date.now()
        });
      });

      let res = await server()
        .get('/api/v1/posts/abc123/analysis');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('record');
    });

    it('Should return empty result if no post is found', async () => {
      let res = await server()
        .get('/api/v1/posts/random123/analysis');

      expect(res.status).to.equal(200);
      expect(res.body).to.have.property('record');
      expect(res.body.record).to.be.null;
    });
  });
});
