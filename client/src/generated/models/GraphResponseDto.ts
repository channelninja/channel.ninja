/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { EdgeResponseDto } from './EdgeResponseDto';
import type { NodeResponseDto } from './NodeResponseDto';

export type GraphResponseDto = {
    nodes: Array<NodeResponseDto>;
    edges: Array<EdgeResponseDto>;
};

