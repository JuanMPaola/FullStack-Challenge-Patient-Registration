import {
    S3Client,
    PutObjectCommand,
    GetObjectCommand,
    DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import type { StorageProvider } from './storage.interface';

export class S3Storage implements StorageProvider {
    private client: S3Client;
    private bucket: string;
    private publicUrl: string;

    constructor() {
        this.client = new S3Client({
            region: 'auto',
            endpoint: process.env.R2_ENDPOINT,
            credentials: {
                accessKeyId: process.env.R2_ACCESS_KEY!,
                secretAccessKey: process.env.R2_SECRET_KEY!,
            },
        });

        this.bucket = process.env.R2_BUCKET!;
        this.publicUrl = process.env.R2_PUBLIC_URL!;
    }

    async upload(key: string, file: Buffer, contentType?: string): Promise<string> {
        console.log('Uploading to bucket:', this.bucket);
        console.log('Key:', key);
        console.log('Endpoint:', process.env.R2_ENDPOINT);

        await this.client.send(
            new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: file,
                ContentType: contentType,
            }),
        );
        return `${this.publicUrl}/${key}`;
    }

    async get(key: string): Promise<NodeJS.ReadableStream> {
        const res = await this.client.send(
            new GetObjectCommand({ Bucket: this.bucket, Key: key }),
        );
        return res.Body as NodeJS.ReadableStream;
    }

    async delete(key: string): Promise<void> {
        await this.client.send(
            new DeleteObjectCommand({ Bucket: this.bucket, Key: key }),
        );
    }
}