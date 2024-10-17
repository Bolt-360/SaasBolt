import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Campaign extends Model {
    static associate(models) {
      Campaign.belongsTo(models.Instance, { foreignKey: 'instanceId' });
      Campaign.belongsTo(models.Workspace, { foreignKey: 'workspaceId' });
      Campaign.hasMany(models.MessageCampaign, { foreignKey: 'campaignId' });
      Campaign.hasMany(models.Recipient, { foreignKey: 'campaignId' });
    }
  }

  Campaign.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('MESSAGE', 'MESSAGE_IMAGE', 'MESSAGE_DOCUMENT'),
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('FINALIZED', 'IN_PROGRESS', 'TO_START'),
      allowNull: false,
      defaultValue: 'TO_START'
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    messageInterval: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    instanceId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: 'Instances',
        key: 'id'
      }
    },
    workspaceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Workspaces',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Campaign',
    tableName: 'Campaigns'
  });

  return Campaign;
};
