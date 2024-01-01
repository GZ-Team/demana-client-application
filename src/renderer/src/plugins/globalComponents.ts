import type { App } from 'vue'

import DGrid from '../components/global/structure/DGrid.vue'
import DList from '../components/global/structure/DList.vue'
import DTable from '../components/global/structure/DTable.vue'

import DSelect from '../components/global/input/DSelect.vue'
import DButton from '../components/global/input/DButton.vue'

import DError from '../components/global/DError.vue'

export default {
  install: (app: App) => {
    // GLOBAL COMPONENTS
    app.component('DGrid', DGrid)
    app.component('DList', DList)
    app.component('DTable', DTable)

    app.component('DSelect', DSelect)
    app.component('DButton', DButton)

    app.component('DError', DError)
  }
}
