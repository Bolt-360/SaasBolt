import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Campaign extends Model {
    static associate(models) {
      Campaign.belongsTo(models.Workspace, {
        foreignKey: 'workspaceId',
        as: 'workspace'
      });
    }
  }

  Campaign.init({
    workspaceId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    startImmediately: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    startDate: DataTypes.DATE,
    messageInterval: DataTypes.INTEGER,
    messages: DataTypes.JSONB,
    instanceIds: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    csvFileUrl: DataTypes.STRING,
    imageUrl: DataTypes.STRING,
    status: {
      type: DataTypes.STRING,
      defaultValue: 'PENDING'
    },
    successCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    failureCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    error: DataTypes.TEXT,
    lastProcessedAt: DataTypes.DATE,
    instanceId: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Campaign',
    tableName: 'Campaigns'
  });

  return Campaign;
};
