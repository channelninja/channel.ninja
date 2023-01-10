/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GraphResponseDto } from '../models/GraphResponseDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GraphService {

    /**
     * Returns the graph
     * @param start
     * @returns GraphResponseDto
     * @throws ApiError
     */
    public static getGraph(
        start: string,
    ): CancelablePromise<GraphResponseDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/graph/network/{start}',
            path: {
                'start': start,
            },
        });
    }

}
