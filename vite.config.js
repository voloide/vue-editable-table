import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'index.js'),
      name: 'EditableTable',
      fileName: () => 'index.js',
      formats: ['es']
    },
    rollupOptions: {
      external: ['vue', 'quasar'],
      output: {
        globals: {
          vue: 'Vue',
          quasar: 'Quasar'
        }
      }
    },
    target: 'modules', // garante suporte moderno (evita erros de "import" como palavra reservada)
    outDir: 'dist',    // garante que o dist/ será usado
    emptyOutDir: true  // limpa dist antes de build
  }
})
