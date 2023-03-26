<script setup>
import TypeViewer from '../components/TypeViewer.vue'
import { ref } from 'vue'
import { schemaStore } from "@/stores/schema";
const schema = await schemaStore();

let selected = "https://schema.org/Thing";

let keys = (obj)=>EcObject.keys(obj);
let display = ref({});

let log = console.log;

let searchText = ref("");

</script>

<template>
<div>
    <input v-model="searchText"/>
    <ul>
        <li v-for="ns of keys(schema.ns)" v-bind:key="ns">
            <!-- <div @click="if (display[ns] == null) display[ns] = false;display[ns] = !display[ns];log(display[ns])">{{ns}}</div> -->
            <div >{{ns}}</div>
            <ul >
                <div v-for="clazz of keys(schema.ns[ns].classes).filter(clazz=>searchText.length > 1 && clazz.toLowerCase().indexOf(searchText.toLowerCase()) != -1).splice(0,30)" v-bind:key="clazz">
                    <TypeViewer :ns="ns" :clazz="clazz"/>
                </div>
            </ul>
        </li>
    </ul>
</div>
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
