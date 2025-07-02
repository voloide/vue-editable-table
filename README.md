# Editable Table

> Componente reutilizável e extensível de tabela editável para Vue 3 + Quasar.

## ✨ Funcionalidades

- Edição inline com botões de salvar/cancelar
- Criação e remoção de linhas
- Alternância de status (ativo/inativo)
- Paginação e ordenação
- Suporte a colunas dinâmicas
- Dropdowns programáticos (ex: província, distrito)
- Barra de pesquisa e botão de adicionar
- Botões de ação customizados via `props.extraActions`
- Slot para botões personalizados no topo

---

## 📦 Instalação

```bash
npm install @voloide/editable-table
```

---

## 🧩 Uso Básico

```js
// main.js ou main.ts
import { createApp } from 'vue'
import App from './App.vue'
import EditableTablePlugin from '@voloide/editable-table'

const app = createApp(App)
app.use(EditableTablePlugin)
app.mount('#app')
```

```vue
<template>
  <EditableTable
    :columns="columns"
    v-model="rows"
    @save="handleSave"
    @delete="handleDelete"
    :loading="isLoading"
  />
</template>

<script setup>
import { ref } from 'vue'

const rows = ref([
  { id: 1, name: 'Maria', status: 'ACTIVE' },
  { id: 2, name: 'João', status: 'INACTIVE' }
])

const columns = [
  { name: 'name', label: 'Nome', field: 'name', align: 'left', editable: true },
  { name: 'status', label: 'Estado', field: 'status', editType: 'toggle' }
]

const isLoading = ref(false)

function handleSave(row, { resolve }) {
  setTimeout(() => resolve({ ...row }), 1000)
}

function handleDelete(row, { resolve }) {
  setTimeout(() => resolve(), 500)
}
</script>
```

---

## ⚙️ Props Principais

| Prop             | Tipo        | Descrição |
|------------------|-------------|-----------|
| `columns`        | `Array`     | Lista de colunas com metadados e configuração de edição |
| `modelValue`     | `Array`     | Lista de objetos que representa as linhas da tabela |
| `loading`        | `Boolean`   | Mostra spinner de carregamento |
| `useExternalAdd` | `Boolean`   | Usa evento `@add` externo em vez de lógica embutida |
| `useExternalEdit`| `Boolean`   | Usa evento `@edit` externo em vez de lógica embutida |
| `extraActions`   | `Array`     | Lista de ações extras personalizadas |
| `topActionsSlot` | `Slot`      | Slot para botões adicionais no topo |

---

## 📡 Eventos

| Evento         | Descrição |
|----------------|-----------|
| `@save`        | Chamado ao salvar uma linha (`(row, { resolve, reject })`) |
| `@delete`      | Chamado ao apagar uma linha (`(row, { resolve, reject })`) |
| `@add`         | Emitido se `useExternalAdd` for `true` |
| `@edit`        | Emitido se `useExternalEdit` for `true` |
| `@search`      | Chamado com o termo de pesquisa |
| `@toggle-status` | Chamado ao alternar estado ativo/inativo |

---

## 🧪 Testes e Contribuições

Você pode sugerir melhorias ou abrir issues via [GitHub](https://github.com/voloide/editable-table)

---

## 📝 Licença

MIT © [Voloide Tamele](https://github.com/voloide)
