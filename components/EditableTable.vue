<script setup>
import { ref, watch, computed } from 'vue'
import { useEditableTable } from '../composables/useEditableTable'
import {
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
} from 'quasar'

const props = defineProps({
  title: String,
  modelValue: Array,
  columns: Array,
  programOptions: Array,
  serviceOptions: Array,
  programActivityOptions: Array,
  provinceOptions: Array,
  districtOptions: Array,
  loading: Boolean,
  pagination: Object,
  rowsPerPageOptions: Array,
  confirmError: Function,
  confirmDelete: Function,
  useExternalAdd: Boolean,
  useExternalEdit: Boolean,
  hideDelete: { type: Boolean, default: false },
  hideEdit: { type: Boolean, default: false },
  hideToggleStatus: { type: Boolean, default: false },
  hideSearchInput: { type: Boolean, default: false },
  hideSearchButton: { type: Boolean, default: false },
  hideAddButton: { type: Boolean, default: false },
  extraActions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:modelValue',
  'save',
  'delete',
  'search',
  'toggle-status',
  'request',
  'add',
  'edit',
  'extra-action',
  'custom-action'
])

const searchParams = ref('')

const paginationLocal = ref({
  sortBy: props.pagination?.sortBy ?? 'id',
  descending: props.pagination?.descending ?? false,
  page: props.pagination?.page ?? 1,
  rowsPerPage: props.pagination?.rowsPerPage ?? 10,
  rowsNumber: props.pagination?.rowsNumber ?? 0
})

watch(() => props.pagination, (val) => {
  paginationLocal.value = {
    sortBy: val?.sortBy ?? 'id',
    descending: val?.descending ?? false,
    page: val?.page ?? 1,
    rowsPerPage: val?.rowsPerPage ?? 10,
    rowsNumber: val?.rowsNumber ?? 0
  }
})

watch(() => props.pagination?.rowsNumber, (rowsNumber) => {
  paginationLocal.value.rowsNumber = rowsNumber ?? 0
})

const {
  rows,
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
} = useEditableTable(props, emit)

const getVisibleActions = computed(() => {
  return (row) => {
    return props.extraActions.filter(action => {
      return typeof action.visible === 'function'
        ? action.visible(row)
        : action.visible !== false
    })
  }
})

const onRequest = (props) => {
  paginationLocal.value = {
    ...props.pagination,
    rowsNumber: paginationLocal.value.rowsNumber
  }
  emit('request', props)
}

// retorna as props certas com base no tipo de edição
const getEditProps = (col) => {
  if (col.editType === 'select') {
    const optionsKey = col.editOptionsKey
    return {
      options: props[optionsKey] || [],
      optionValue: 'value',
      optionLabel: 'label',
      emitValue: true,
      mapOptions: true,
      dense: true,
      outlined: true,
      placeholder: col.placeholder || 'Selecionar'
    }
  }

  if (col.editType === 'toggle') {
    return {
      dense: true,
      keepColor: true,
      color: 'primary'
    }
  }

  return {
    dense: true,
    outlined: true,
    placeholder: col.placeholder || col.label
  }
}
</script>

<template>
  <q-card class="q-pa-none" flat bordered>
    <q-card-section class="text-h6 q-pa-none">
      <q-banner dense inline-actions class="text-primary bg-grey-3">
        <span class="text-subtitle2 text-primary">{{ props.title }}</span>
        <template #action>
          <q-input
            outlined
            label="Pesquisar por Nome, descrição, Código"
            dense
            style="width: 300px;"
            color="white"
            v-model="searchParams"
            @keyup.enter="search(searchParams)"
            :disable="isEditingAnyRow"
            v-if="!props.hideSearchInput"
          >
            <template #append>
              <q-icon
                v-if="searchParams"
                name="close"
                @click="() => { searchParams = ''; search('') }"
                class="cursor-pointer"
              />
            </template>
          </q-input>

          <q-btn
            outline
            style="color: goldenrod;"
            dense
            icon="search"
            @click="search(searchParams)"
            :disable="isEditingAnyRow"
            class="q-ml-sm"
            v-if="!props.hideSearchButton"
          >
            <q-tooltip class="bg-primary">Pesquisar</q-tooltip>
          </q-btn>

          <q-btn
            outline
            style="color: goldenrod;"
            dense
            icon="add"
            class="q-ml-sm"
            @click="props.useExternalAdd ? emit('add') : addRow()"
            :disable="isEditingAnyRow"
            v-if="!props.hideAddButton"
          >
            <q-tooltip class="bg-primary">Criar novos {{ props.title }}</q-tooltip>
          </q-btn>

          <slot name="action-buttons" />
        </template>
      </q-banner>
    </q-card-section>

    <q-card-section class="q-pa-md">
      <q-table
        :rows="rows"
        :columns="props.columns"
        row-key="id"
        flat
        dense
        separator="horizontal"
        v-model:pagination="paginationLocal"
        :rows-per-page-options="props.rowsPerPageOptions"
        :pagination-label="(first, last, total) => `${first}-${last} de ${total} registros`"
        @request="onRequest"
      >
        <template
          v-for="col in visibleColumns"
          :key="col.name"
          #[`body-cell-${col.name}`]="{ row }"
        >
          <q-td :style="col.style">
            <template v-if="isEditing(row)">
              <component
                :is="col.editType === 'select' ? 'q-select' : col.editType === 'toggle' ? 'q-toggle' : 'q-input'"
                v-model="row[col.editValueField || col.field]"
                v-bind="getEditProps(col)"
              />
            </template>
            <template v-else>
              {{ row[col.field] || '—' }}
            </template>
          </q-td>
        </template>

        <template #body-cell-actions="{ row }">
          <q-td class="text-center">
            <div v-if="isEditing(row)">
              <q-btn dense flat icon="check" color="green" @click="saveRow(row)" />
              <q-btn dense flat icon="close" color="orange" @click="cancelEdit(row)" />
            </div>
            <div v-else class="q-gutter-sm">
              <q-btn
                v-if="!props.hideToggleStatus"
                dense flat
                :icon="row.lifeCycleStatus === 'ACTIVE' ? 'toggle_on' : 'toggle_off'"
                :color="row.lifeCycleStatus === 'ACTIVE' ? 'green' : 'grey'"
                @click="toggleStatus(row)"
                :disable="isEditingAnyRow"
              />
              <q-btn
                v-if="!props.hideEdit"
                dense flat icon="edit" color="primary"
                @click="props.useExternalEdit ? emit('edit', row) : editRow(row)"
              />
              <q-btn
                v-if="!props.hideDelete"
                dense flat icon="delete" color="red"
                @click="deleteRow(row)"
              />
              <q-btn
                v-for="(action, index) in getVisibleActions(row)"
                :key="index"
                dense flat
                :icon="action.icon"
                :color="action.color || 'primary'"
                @click="emit(action.emit || 'extra-action', row)"
              >
                <q-tooltip class="bg-primary">{{ action.tooltip }}</q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>
