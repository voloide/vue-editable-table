import EditableTable from './components/EditableTable.vue'

export { EditableTable }

export default {
  install(app) {
    app.component('EditableTable', EditableTable)
  }
}
