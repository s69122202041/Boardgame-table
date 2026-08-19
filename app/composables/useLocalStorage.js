import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const data = ref(defaultValue)

  const load = () => {
    if (!import.meta.client) {
      return
    }

    try {
      const savedData = localStorage.getItem(key)

      if (savedData !== null) {
        data.value = JSON.parse(savedData)
      }
    } catch (error) {
      console.error(`Cannot load localStorage key: ${key}`, error)
      data.value = defaultValue
    }
  }

  const save = () => {
    if (!import.meta.client) {
      return
    }

    try {
      localStorage.setItem(key, JSON.stringify(data.value))
    } catch (error) {
      console.error(`Cannot save localStorage key: ${key}`, error)
    }
  }

  const remove = () => {
    if (!import.meta.client) {
      return
    }

    localStorage.removeItem(key)
    data.value = defaultValue
  }

  const clear = () => {
    remove()
  }

  if (import.meta.client) {
    load()

    watch(
      data,
      () => {
        save()
      },
      {
        deep: true
      }
    )
  }

  return {
    data,
    load,
    save,
    remove,
    clear
  }
}