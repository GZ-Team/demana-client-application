import DGrid from '@renderer/components/global/structure/DGrid.vue'
import DList from '@renderer/components/global/structure/DList.vue'
import DTable from '@renderer/components/global/structure/DTable.vue'

import DSelect from '@renderer/components/global/input/DSelect.vue'
import DButton from '@renderer/components/global/input/DButton.vue'

export default {
  install: (app) => {
    // GLOBAL COMPONENTS
    app.component('DGrid', DGrid)
    app.component('DList', DList)
    app.component('DTable', DTable)

    app.component('DSelect', DSelect)
    app.component('DButton', DButton)
  }
}
