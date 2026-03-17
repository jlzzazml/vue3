import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppearStore = defineStore(
  'appearSet',
  () => {
    const currentAppear = ref({
      asideColor: '#649884',
      headerColor: '#94baa9'
    })
    const setAppear = (newColor) => {
      currentAppear.value = newColor
    }
    return {
      currentAppear,
      setAppear
    }
  },
  { persist: true }
)
