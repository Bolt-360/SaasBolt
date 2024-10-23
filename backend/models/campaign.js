import { DataTypes } from 'sequelize';
import minioClient from '../config/minio.js';

export default (sequelize) => {
  const Campaign = sequelize.define('Campaign', {
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startImmediately: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    messageInterval: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    messages: {
      type: DataTypes.JSON,
      allowNull: true
    },
    instanceIds: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    },
    csvFileUrl: {
      type: DataTypes.STRING(500), // Aumentamos o tamanho para acomodar nomes de arquivo longos
      allowNull: true
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true
    }
  });

  Campaign.prototype.getFullCsvUrl = async function() {
    if (!this.csvFileUrl) return null;
    const bucketName = process.env.MINIO_BUCKET || 'campaigns';
    return await minioClient.presignedGetObject(bucketName, this.csvFileUrl, 24*60*60);
  };

  return Campaign;
};
