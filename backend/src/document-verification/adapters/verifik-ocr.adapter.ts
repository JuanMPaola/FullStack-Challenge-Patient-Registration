import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { DocumentScanResult } from '../interfaces/document-verifier.interface';

@Injectable()
export class VerifikOcrAdapter {
    private readonly logger = new Logger(VerifikOcrAdapter.name);

    constructor(private readonly configService: ConfigService) { }

    async scanDocument(imageBase64: string, documentType: string): Promise<DocumentScanResult> {
        try {
            const { data } = await axios.post(
                `${this.configService.get('VERIFIK_API_URL')}/ocr/scan-prompt`,
                {
                    image: imageBase64,
                    documentType: documentType === 'DNI_AR' ? 'DNIAR' : 'CCUY',
                },
                {
                    headers: {
                        Authorization: `jwt ${this.configService.get('VERIFIK_TOKEN')}`,
                    },
                },
            );
            console.log('Verifik response:', JSON.stringify(data, null, 2));
            return {
                isDocument: true,
                firstName: data.data?.OCRExtraction?.firstName ?? '',
                lastName: data.data?.OCRExtraction?.lastName ?? '',
                documentNumber: data.data?.OCRExtraction?.documentNumber,
                dateOfBirth: data.data?.OCRExtraction?.dateOfBirth,
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.logger.warn(`OCR scan failed: ${message}`);
            return { isDocument: false, firstName: '', lastName: '' };
        }
    }
}