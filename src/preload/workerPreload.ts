import { attachApisToProcess, sharedPreloadApi } from './sharedPreload';

import type { DemanaSharedPreloadApi } from './sharedPreload';

export type DemanaWorkerProcessPreloadApi = DemanaSharedPreloadApi;

const workerPreloadApi: DemanaWorkerProcessPreloadApi = sharedPreloadApi;

attachApisToProcess({ api: workerPreloadApi });
