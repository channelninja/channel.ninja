/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InitResponseDto } from '../models/InitResponseDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class InitService {

    /**
     * @returns InitResponseDto
     * @throws ApiError
     */
    public static init(): CancelablePromise<InitResponseDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/init',
        });
    }

}
