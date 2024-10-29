import minioClient from '../config/minio.js';

export const getCsvContent = async (csvFileUrl) => {
    try {
        if (!csvFileUrl) throw new Error('URL do arquivo CSV não fornecida');

        const urlParts = csvFileUrl.split('/');
        const bucketName = urlParts[0];
        const objectName = urlParts.slice(1).join('/');
        
        const stream = await minioClient.getObject(bucketName, objectName);
        const chunks = [];

        return new Promise((resolve, reject) => {
            stream.on('data', chunk => chunks.push(chunk));
            stream.on('error', reject);
            stream.on('end', () => {
                const content = Buffer.concat(chunks).toString('utf-8');
                resolve(content);
            });
        });
    } catch (error) {
        console.error('Erro ao buscar arquivo CSV:', error);
        throw new Error('Erro ao buscar arquivo CSV');
    }
};