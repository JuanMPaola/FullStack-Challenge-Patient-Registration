import { Injectable, Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { extname } from 'path';
import type { StorageProvider } from './storage.interface';
import { S3Storage } from './s3.storage';

@Injectable()
export class StorageService {
  private readonly logger = new Logger(StorageService.name);
  private readonly provider: StorageProvider;

  constructor() {
    this.provider = new S3Storage();
  }

  async uploadFile(filePath: string, mimeType: string): Promise<string> {
    const key = `${Date.now()}-${Math.random().toString(36).slice(2)}${extname(filePath)}`;
    const buffer = readFileSync(filePath);
    const url = await this.provider.upload(key, buffer, mimeType);
    this.logger.log(`Uploaded file: ${key}`);
    return url;
  }

  async uploadBuffer(buffer: Buffer, mimeType: string): Promise<string> {
    const key = `${Date.now()}-${Math.random().toString(36).slice(2)}.jpg`;
    const url = await this.provider.upload(key, buffer, mimeType);
    this.logger.log(`Uploaded buffer: ${key}`);
    return url;
  }

  getFile(key: string) {
    return this.provider.get(key);
  }

  deleteFile(key: string) {
    return this.provider.delete(key);
  }
}