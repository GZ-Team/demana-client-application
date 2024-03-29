import queries from './queries'
import mutations from './mutations'

import type { Paths } from '@root/types'

export type GraphQLQueryOperationPath = Paths<typeof queries>;
export type GraphQLMutationOperationPath = Paths<typeof mutations>;

export default {
    queries,
    mutations
}
