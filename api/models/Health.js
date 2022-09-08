module.exports = (sequelize, DataTypes) => {
  return sequelize.define('Health', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    createdAt: {
      type: DataTypes.DATE
    },
    updatedAt: {
      type: DataTypes.DATE
    }
  }, {
    tableName: 'health'
  });
};
