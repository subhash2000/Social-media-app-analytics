module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Posts', {
    uniqueIdentifier: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    wordCount: {
      type: DataTypes.INTEGER
    },
    averageWordLength: {
      type: DataTypes.FLOAT
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'Posts'
  });
};
