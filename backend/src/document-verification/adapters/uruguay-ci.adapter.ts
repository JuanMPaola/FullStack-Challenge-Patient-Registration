import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import type { DocumentVerifier, DocumentVerificationResult } from '../interfaces/document-verifier.interface';

@Injectable()
export class UruguayCiAdapter implements DocumentVerifier {
    private readonly logger = new Logger(UruguayCiAdapter.name);

    constructor(private readonly configService: ConfigService) { }

    async verify(documentNumber: string, extraParams?: Record<string, string>): Promise<DocumentVerificationResult> {
        try {
            const { data } = await axios.get(
                `${this.configService.get('VERIFIK_API_URL')}/uy/cedula`,
                {
                    params: {
                        documentType: 'CCUY',
                        documentNumber,
                        dateOfBirth: extraParams?.dateOfBirth,
                    },
                    headers: { Authorization: `jwt ${this.configService.get('VERIFIK_TOKEN')}` },
                },
            );

            return {
                isValid: true,
                fullName: data.data?.fullName,
                documentNumber,
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.logger.warn(`DNI AR verification failed for ${documentNumber}: ${message}`);
            return { isValid: false };
        }
    }
}