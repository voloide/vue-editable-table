import { Quasar, QCard, QCardSection, QBanner, QInput, QIcon, QBtn, QTable, QTd, QSelect, QToggle, QTooltip } from 'quasar'
import EditableTable from './components/EditableTable.vue'

export { EditableTable }

export default {
  install(app) {
    app.use(Quasar, {
      components: {
        QCard,
        QCardSection,
        QBanner,
        QInput,
        QIcon,
        QBtn,
        QTable,
        QTd,
        QSelect,
        QToggle,
        QTooltip
      }
    })

    app.component('EditableTable', EditableTable)
  }
}
