/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LndInvoiceResponseDto } from '../models/LndInvoiceResponseDto';
import type { NodeInfoDto } from '../models/NodeInfoDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class LndService {

    /**
     * Creates an invoice
     * @returns LndInvoiceResponseDto
     * @throws ApiError
     */
    public static createInvoice(): CancelablePromise<LndInvoiceResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/lnd/invoice',
        });
    }

    /**
     * Gets the node info
     * @param pubkey
     * @returns NodeInfoDto
     * @throws ApiError
     */
    public static getNodeInfo(
        pubkey: string,
    ): CancelablePromise<NodeInfoDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/lnd/nodeInfo/{pubkey}',
            path: {
                'pubkey': pubkey,
            },
        });
    }

}
