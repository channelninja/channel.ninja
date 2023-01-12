/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { NodeResponseDto } from '../models/NodeResponseDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class SuggestionsService {

    /**
     * Returns suggested nodes for :start node
     * @param start
     * @returns NodeResponseDto
     * @throws ApiError
     */
    public static getSuggestions(
        start: string,
    ): CancelablePromise<Array<NodeResponseDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/suggestions/{start}',
            path: {
                'start': start,
            },
        });
    }

}
