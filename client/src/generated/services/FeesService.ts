/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GetOnchainFeesEstimate } from '../models/GetOnchainFeesEstimate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FeesService {

    /**
     * Gets an estimate for onchain transaction fees.
     * @returns GetOnchainFeesEstimate
     * @throws ApiError
     */
    public static getOnchainFeesEstimate(): CancelablePromise<GetOnchainFeesEstimate> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/fees/onchain',
        });
    }

}
