import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base must match your GitHub repo name for Pages hosting:
// https://<username>.github.io/CreativeSkillNexus/
export default defineConfig({
  plugins: [react()],
  base: '/creativeskillnex',
})




