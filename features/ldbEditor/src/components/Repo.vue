<script setup>
import { schemaStore } from "@/stores/schema";
const schema = await schemaStore();
let props = defineProps({
  server: {
    type: String,
    required: true,
  }
})

let repo = new window.EcRepository();
console.log(this);
let pingResults = null;
await repo.init(props.server,null,null,results=>pingResults = results);

let increment = ()=>{schema.increment()};

</script>

<template>
    <!-- main content -->
    <div class="greetings">
        <div>Server: {{server}}</div>
        <div>Time Offset: {{repo.timeOffset}} ms</div>
        <div>{{pingResults}}</div>
        <div>{{schema.count}}</div>
        <button @click="increment">Button</button>
    </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
