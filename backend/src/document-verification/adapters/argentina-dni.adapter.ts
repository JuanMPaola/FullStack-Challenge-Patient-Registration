import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import type { DocumentVerifier, DocumentVerificationResult } from '../interfaces/document-verifier.interface';

@Injectable()
export class ArgentinaDniAdapter implements DocumentVerifier {
    private readonly logger = new Logger(ArgentinaDniAdapter.name);

    constructor(private readonly configService: ConfigService) { }

    async verify(documentNumber: string): Promise<DocumentVerificationResult> {
        try {
            const { data } = await axios.get(
                `${this.configService.get('VERIFIK_API_URL')}/ar/cedula`,
                {
                    params: { documentType: 'DNIAR', documentNumber },
                   headers: { Authorization: `jwt ${this.configService.get('VERIFIK_TOKEN')}` },
                },
            );

            return {
                isValid: true,
                isDocument: true,
                firstName: data.data?.firstName ?? '',
                lastName: data.data?.lastName ?? '',
                documentNumber,
            };
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : 'Unknown error';
            this.logger.warn(`DNI AR verification failed for ${documentNumber}: ${message}`);
            return { isValid: false, firstName: '', lastName: '' };
        }
    }
}