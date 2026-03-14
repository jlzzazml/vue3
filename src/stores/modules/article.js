// store/article.js (Pinia)
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useArticleStore = defineStore(
  'articleID',
  () => {
    const currentArticleID = ref()
    const setCurrentArticle = (articleID) => {
      currentArticleID.value = articleID
    }
    return {
      currentArticleID,
      setCurrentArticle
    }
  },
  { persist: true }
)
