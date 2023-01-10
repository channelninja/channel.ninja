/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SocketDto } from './SocketDto';

export type NodeInfoDto = {
    alias: string;
    capacity: number;
    channel_count: number;
    color: string;
    sockets: Array<SocketDto>;
    updated_at?: string;
};

