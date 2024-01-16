const _ = require('lodash'),
    getModel = require('../helpers/getModel');

module.exports = {
    createPosts: async function (record, transaction) {
        const Posts = getModel('Posts');

        if (_.isEmpty(record)) {
            return Promise.reject(new Error('PostsRepository~create: Mandatory Parameters missing'));
        }

        return Posts.create(record, { transaction });
    },

    findByUniqueIdentifier: async function (uniqueIdentifier) {
        const Posts = getModel('Posts');

        if (_.isEmpty(uniqueIdentifier)) {
            return Promise.reject(new Error('PostsRepository~findByUniqueIdentifier: Mandatory Parameters missing'));
        }

        return Posts.findOne({ where: { uniqueIdentifier } });
    }
};

