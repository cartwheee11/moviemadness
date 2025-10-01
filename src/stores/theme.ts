import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useTheme = defineStore('theme', () => {
  const localTheme = localStorage.getItem('theme')
  const current = ref('')

  function adjustHtmlColor() {
    const html = document.querySelector('html')
    html?.setAttribute('data-theme', current.value)
  }

  if (!localTheme) {
    current.value = 'pastel'
    localStorage.setItem('theme', 'pastel')
  } else {
    current.value = localTheme
  }

  adjustHtmlColor()

  function toggle() {
    current.value = current.value == 'pastel' ? 'sunset' : 'pastel'
    localStorage.setItem('theme', current.value)
    adjustHtmlColor()
  }

  return { current, toggle }
})
