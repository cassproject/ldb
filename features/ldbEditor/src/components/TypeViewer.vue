<script setup>
let props = defineProps({
  ns: {
    type: String,
    required: true,
  },
  clazz: {
    type: String,
    required: true,
  }
})

import { ref } from 'vue'
import { schemaStore } from "@/stores/schema";
const schema = await schemaStore();

let selected = "https://schema.org/Thing";

let ns = props.ns;
let clazz = props.clazz;

let keys = (obj)=>EcObject.keys(obj);

let log = console.log;

let inheritExpand = ref(false);

let searchText = ref("");

</script>

<template>
<li>
    <div>{{schema.getDisplayLabel(clazz)}}</div>
    <div><small><em>{{ schema.getDescriptionLabel(clazz) }}</em></small></div>
    <ul v-if="schema.ns[ns].classes[clazz].properties">
        <li v-for="prop of keys(schema.ns[ns].classes[clazz].properties)" v-bind:key="prop">
                <div>{{ schema.getDisplayLabel(prop) }}</div>
                <div v-for="range of prop['http://schema.org/rangeIncludes']" v-bind:key="range">{{ range }}</div>
                <div><small><em>{{ schema.getDescriptionLabel(prop) }}</em></small></div>
        </li>
    </ul>
    <div v-if="schema.ns[ns].classes[clazz].superClass">
        Child of <span v-if="!inheritExpand">{{schema.getDisplayLabel(schema.ns[ns].classes[clazz].superClass['@id'])}} <button @click="inheritExpand = !inheritExpand" >+</button></span>
        <ul v-else > <button @click="inheritExpand = !inheritExpand" >-</button><TypeViewer :ns="ns" :clazz="schema.ns[ns].classes[clazz].superClass['@id']"/></ul>
    </div>
</li>
</template>

<style>
li {
    list-style: none;
    padding-left:0px;
}
li li {
    list-style: disc;
}
li li li{
    list-style: circle;
}
</style>
