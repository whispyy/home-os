import './app.css'
import App from './App.svelte'

const element = document.getElementById('app');

if (!element) throw new Error('#app element not found');

const app = new App({
  target: element,
})

export default app
