// src/components/.../composables/useEditableTable.js
import { ref, computed, watch, onBeforeUnmount, watchEffect } from 'vue'
import { Loading, QSpinnerRings } from 'quasar'

export function useEditableTable (props, emit) {
  const rows = ref([...(props.modelValue ?? [])])
  const dependencyWatchers = new Map()

  watch(() => props.modelValue, val => {
    rows.value = [...(val ?? [])]
  })

  // Loading overlay
  let loadingShown = false
  watchEffect(() => {
    if (props.loading) {
      if (!loadingShown) {
        loadingShown = true
        setTimeout(() => {
          Loading.show({ spinner: QSpinnerRings })
        }, 0)
      }
    } else if (loadingShown) {
      loadingShown = false
      Loading.hide()
    }
  })
  onBeforeUnmount(() => Loading.hide())

  // Edit state
  const editingRows = ref(new Set())
  const isEditing = (row) => editingRows.value.has(row)
  const isEditingAnyRow = computed(() => editingRows.value.size > 0)

  const visibleColumns = computed(() =>
    (props.columns ?? []).filter(c => c && c.name !== 'actions')
  )

  // ---------- FLAG HELPERS (JS) ----------
  const evalFlag = (flag, row) =>
    typeof flag === 'function' ? !!flag({ row, props }) : !!flag

  const isEditableCol = (col, row) =>
    !!col?.editType &&
    (col.editable === undefined ? true : evalFlag(col.editable, row)) &&
    !evalFlag(col.hideInEdit, row)

  const isDisabledCol = (col, row) => evalFlag(col?.disabled, row)
  const isReadonlyCol = (col, row) => evalFlag(col?.readonly, row)
  const isRequiredCol = (col, row) => evalFlag(col?.required, row)

  const fieldNameOf = (col) =>
    col.editValueField || (typeof col.field === 'string' ? col.field : col.name)

  // ---------- Actions ----------
  const addRow = () => {
    if (props.useExternalAdd) {
      emit('add')
      return
    }
    if (isEditingAnyRow.value) {
      props.confirmError?.('Termine a edição atual antes de criar um novo registo.')
      return
    }

    const newRow = { _isNew: true, lifeCycleStatus: 'ACTIVE' }

    // init only editable inputs
    for (const col of visibleColumns.value) {
      if (!isEditableCol(col, newRow)) continue
      const f = fieldNameOf(col)
      if (!f) continue
      newRow[f] = col.editType === 'toggle' ? false : null
    }

    rows.value.unshift(newRow)
    editingRows.value.add(newRow)
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

    // reset dependent fields when parent changes
    const depFields = Array.from(new Set(
      (props.columns || []).flatMap(col => {
        const a = []
        if (col.dependsOn) a.push(col.dependsOn)
        if (Array.isArray(col.resetOnChangeOf)) a.push(...col.resetOnChangeOf)
        else if (col.resetOnChangeOf) a.push(col.resetOnChangeOf)
        return a
      }).filter(Boolean)
    ))

    const unwatch = watch(
      () => depFields.map(f => row[f]),
      (newVals, oldVals) => {
        const changed = new Set(
          depFields.filter((f, i) => newVals?.[i] !== oldVals?.[i])
        )

        // 1) reset padrão: quando parent (dependsOn) muda, zera o filho
        ;(props.columns || []).forEach(col => {
          if (col.dependsOn && col.matchField && changed.has(col.dependsOn)) {
            const f = fieldNameOf(col)
            if (f) row[f] = null
          }
        })

        // 2) resets custom: resetOnChangeOf / onReset
        ;(props.columns || []).forEach(col => {
          const toWatch = Array.isArray(col.resetOnChangeOf)
            ? col.resetOnChangeOf
            : (col.resetOnChangeOf ? [col.resetOnChangeOf] : [])
          if (toWatch.some(f => changed.has(f))) {
            if (typeof col.onReset === 'function') {
              col.onReset({ row, col, changedFields: Array.from(changed) })
            } else {
              const f = fieldNameOf(col)
              if (f) row[f] = null
            }
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
    } else if (row._backup) {
      Object.assign(row, row._backup)
      delete row._backup
    }

    const unwatch = dependencyWatchers.get(row)
    if (unwatch) unwatch()
    dependencyWatchers.delete(row)

    editingRows.value.delete(row)
    emit('update:modelValue', [...rows.value])
  }

  const saveRow = async (row) => {
    // 1️⃣ Validate required, inline-editable, enabled inputs
    const missingCol = (props.columns || []).find(col => {
      if (!col || col.name === 'actions') return false
      if (!isEditableCol(col, row)) return false
      if (!isRequiredCol(col, row)) return false
      if (isDisabledCol(col, row) || isReadonlyCol(col, row)) return false

      const f = fieldNameOf(col)
      const v = f ? row[f] : undefined
      return v === null || v === undefined || v === ''
    })

    if (missingCol) {
      const label = missingCol.label || missingCol.name
      props.confirmError?.(`O campo "${label}" é obrigatório.`)
      return
    }

    // 2️⃣ Check for duplicate rows based on unique columns
    const uniqueCols = (props.columns || []).filter(c => c.uniqueKey)
    if (uniqueCols.length > 0) {
      const buildKey = (r) => uniqueCols.map(c => r[fieldNameOf(c)] ?? '').join('|')
      const newKey = buildKey(row)

      // count how many rows have the same key
      const occurrences = rows.value.filter(r => buildKey(r) === newKey).length
      const duplicates = occurrences - 1 // subtract current row itself
      if (duplicates > 0) {
        emit('validation-error', {
          kind: 'unique',
          fields: uniqueCols.map(c => fieldNameOf(c)),
          labels: uniqueCols.map(c => c.label || c.name),
          values: uniqueCols.map(c => row[fieldNameOf(c)]),
          row
        })
        return
      }
    }

    // 3️⃣ Try saving the row
    try {
      const savedRow = await new Promise((resolve, reject) => {
        emit('save', row, { resolve, reject })
      })

      Object.assign(row, savedRow)
      delete row._backup
      delete row._isNew

      dependencyWatchers.get(row)?.()
      dependencyWatchers.delete(row)
      editingRows.value.delete(row)

      emit('update:modelValue', [...rows.value])
    } catch (err) {
      const msg = (err && err.message) ? err.message : 'Erro ao salvar a linha.'
      props.confirmError?.(msg)
      console.error('Erro ao salvar a linha:', err)
    }
  }


  const deleteRow = async (row) => {
    if (editingRows.value.size > 0 && !isEditing(row)) {
      props.confirmError?.('Termine a edição atual antes de apagar outro registo.')
      return
    }
    try {
      const ok = await props.confirmDelete?.(
        'Deseja realmente apagar este registo? Esta ação não poderá ser desfeita.'
      )
      if (!ok) return

      await new Promise((resolve, reject) => {
        emit('delete', row, { resolve, reject })
      })

      const unwatch = dependencyWatchers.get(row)
      if (unwatch) unwatch()
      dependencyWatchers.delete(row)

      rows.value = rows.value.filter(r => r !== row)
      editingRows.value.delete(row)
      emit('update:modelValue', [...rows.value])
    } catch (err) {
      console.error('Erro ao apagar a linha:', err)
    }
  }

  watch(isEditingAnyRow, (val) => {
    emit('editing-change', !!val)   // payload: boolean
  }, { immediate: true })

  const search = (term) => emit('search', (term || '').trim())
  const toggleStatus = (row) => emit('toggle-status', row)

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
