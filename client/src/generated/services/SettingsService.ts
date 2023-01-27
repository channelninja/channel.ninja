/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FeeAmountDto } from '../models/FeeAmountDto';
import type { FeeUnitDto } from '../models/FeeUnitDto';
import type { MaintenanceDto } from '../models/MaintenanceDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SettingsService {

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static setMaintenance(
        requestBody: MaintenanceDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/settings/maintenance',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static setFeeUnit(
        requestBody: FeeUnitDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/settings/fee_unit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody
     * @returns any
     * @throws ApiError
     */
    public static setFeeAmount(
        requestBody: FeeAmountDto,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/settings/fee_amount',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
