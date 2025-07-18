
import { ref, computed, watch, onBeforeUnmount, watchEffect } from 'vue'
import { Loading, QSpinnerRings } from 'quasar'

export function useEditableTable(props, emit) {
  const rows = ref([...props.modelValue])
  const dependencyWatchers = new Map()

  watch(() => props.modelValue, val => {
    rows.value = [...val]
  })

  let loadingShown = false
  watchEffect(() => {
    if (props.loading) {
      if (!loadingShown) {
        loadingShown = true
        setTimeout(() => {
          Loading.show({ spinner: QSpinnerRings })
        }, 0)
      }
    } else {
      if (loadingShown) {
        loadingShown = false
        Loading.hide()
      }
    }
  })

  onBeforeUnmount(() => Loading.hide())

  const editingRows = ref(new Set())
  const isEditing = (row) => editingRows.value.has(row)
  const isEditingAnyRow = computed(() => editingRows.value.size > 0)

  const visibleColumns = computed(() =>
    props.columns.filter(col => col.name !== 'actions')
  )

  const addRow = () => {
    if (props.useExternalAdd) {
      emit('add')
      return
    }

    if (isEditingAnyRow.value) {
      props.confirmError?.('Termine a edição atual antes de criar um novo registo.')
      return
    }

    const newRow = {
      _isNew: true,
      lifeCycleStatus: 'ACTIVE'
    }

    visibleColumns.value.forEach(col => {
      const field = col.editValueField || col.field
      newRow[field] = ''
    })

    rows.value.unshift(newRow)
    editingRows.value.add(newRow)

    // ⚠️ Não emita update:modelValue ainda, deixe para o save
    // emit('update:modelValue', [...rows.value])
  }


  const editRow = (row) => {
    if (props.useExternalEdit) {
      emit('edit', row)
      return
    }

    if (isEditingAnyRow.value) {
      props.confirmError?.('Termine a edição atual antes de editar outro registo.')
      return
    }

    row._backup = { ...row }
    editingRows.value.add(row)

    // watcher para resetar campos dependentes
    const unwatch = watch(
      () => props.columns.map(col => row[col.dependsOn]),
      () => {
        props.columns.forEach(col => {
          if (col.dependsOn && col.matchField) {
            row[col.editValueField || col.field] = null
          }
        })
      },
      { deep: false }
    )

    dependencyWatchers.set(row, unwatch)
  }

  const cancelEdit = (row) => {
    if (row._isNew) {
      rows.value = rows.value.filter(r => r !== row)
    } else {
      if (row._backup) {
        Object.assign(row, row._backup)
        delete row._backup
      }
    }

    if (dependencyWatchers.has(row)) {
      dependencyWatchers.get(row)()
      dependencyWatchers.delete(row)
    }

    editingRows.value.delete(row)
    emit('update:modelValue', [...rows.value])
  }

  const saveRow = async (row) => {
    const requiredFields = visibleColumns.value
      .filter(col => col.editType !== 'toggle')
      .map(col => col.editValueField || col.field)

    const invalidField = requiredFields.find(field => {
      const value = row[field]
      return value === null || value === undefined || value === ''
    })

    if (invalidField) {
      const col = props.columns.find(c => (c.editValueField || c.field) === invalidField)
      const label = col?.label || invalidField
      props.confirmError?.(`O campo "${label}" é obrigatório.`)
      return
    }

    try {
      const savedRow = await new Promise((resolve, reject) => {
        emit('save', row, { resolve, reject })
      })

      Object.assign(row, savedRow)
      delete row._backup
      delete row._isNew

      if (dependencyWatchers.has(row)) {
        dependencyWatchers.get(row)()
        dependencyWatchers.delete(row)
      }

      editingRows.value.delete(row)
      emit('update:modelValue', [...rows.value])
    } catch (err) {
      console.error('Erro ao salvar a linha:', err)
    }
  }

  const deleteRow = async (row) => {
    if (editingRows.value.size > 0 && !isEditing(row)) {
      props.confirmError?.('Termine a edição atual antes de apagar outro registo.')
      return
    }
    try {
      const confirm = await props.confirmDelete?.(
        'Deseja realmente apagar este registo? Esta ação não poderá ser desfeita.'
      )
      if (!confirm) return
      
      await new Promise((resolve, reject) => {
        emit('delete', row, { resolve, reject })
      })

      console.log('deleteGroupHandler', row)

      if (dependencyWatchers.has(row)) {
        dependencyWatchers.get(row)()
        dependencyWatchers.delete(row)
      }

      rows.value = rows.value.filter(r => r !== row)
      editingRows.value.delete(row)
      emit('update:modelValue', [...rows.value])
    } catch (err) {
      console.error('Erro ao apagar a linha:', err)
    }
  }

  const search = (term) => {
    emit('search', term.trim())
  }

  const toggleStatus = (row) => {
    emit('toggle-status', row)
  }

  return {
    rows,
    editingRows,
    isEditing,
    isEditingAnyRow,
    addRow,
    editRow,
    cancelEdit,
    saveRow,
    deleteRow,
    search,
    toggleStatus,
    visibleColumns
  }
}