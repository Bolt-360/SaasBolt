import { Client } from 'minio';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente do arquivo .env
dotenv.config();

const minioClient = new Client({
    endPoint: process.env.MINIO_ENDPOINT || 'localhost',
    port: parseInt(process.env.MINIO_PORT || '9000'),
    useSSL: process.env.MINIO_USE_SSL === 'true',
    accessKey: process.env.MINIO_ROOT_USER,
    secretKey: process.env.MINIO_ROOT_PASSWORD,
    // Adicione esta linha:
    insecure: process.env.MINIO_USE_SSL !== 'true'
});

// Criar bucket se não existir
const initializeMinio = async () => {
    try {
        const bucketName = process.env.MINIO_BUCKET_NAME || 'campaigns';
        const bucketExists = await minioClient.bucketExists(bucketName);
        
        if (!bucketExists) {
            await minioClient.makeBucket(bucketName);
            console.log('Bucket criado com sucesso');
        }
    } catch (error) {
        console.error('Erro ao inicializar MinIO:', error);
    }
};

initializeMinio();

export default minioClient;
