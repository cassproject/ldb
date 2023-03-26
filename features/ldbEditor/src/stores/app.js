import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const schemaStore = defineStore('app', () => {

  let out = {};
  out.count = ref(0)
  out.doubleCount = computed(() => out.count.value * 2)
  out.increment = ()=>{
    out.count.value++
  }

  return out;
})
