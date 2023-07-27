<script setup>
import { ref, watch, reactive, computed, nextTick } from 'vue'
import debounce from 'lodash/debounce'
import LDTable from '../components/LDTable.vue'

import { schemaStore } from "@/stores/schema";
const schema = await schemaStore();
await schema.fetchSchema('http://schema.org/', 'schemaorg-all-http.jsonld');
// await schema.fetchSchema('https://schema.org/', 'schemaorg-all-https.jsonld');
await schema.fetchSchema('http://schema.cassproject.org/0.3', 'http://schema.cassproject.org/0.3');

let searchText = ref("");

let repo = ref(new EcRepository());
await repo.value.init("https://dev.cassproject.org/api/");

let data = reactive([]);

watch(searchText, debounce(async (first, second) => {
    let searchResults = await repo.value.search(searchText.value);
    data.splice(0,data.length);
    data.push(...searchResults);
},500));

let selectedClassId = ref("http://schema.org/Thing");

let selectedClass = computed(()=>schema.classes[selectedClassId.value]);

let headers = computed(()=>{
    let cl = selectedClass.value;
    let results = [];
    if (cl.properties != null)
        results.push(...Object.values(cl.properties));
    while (cl.superClass != null) {
        cl = cl.superClass;
        if (cl.properties != null)
            results.push(...Object.values(cl.properties));
    }
    return results;
});

</script>

<template>
    <div>
        {{ repo.selectedServer }}data?q=
        <input type="text" v-model="searchText" />
        <p>
            <select v-model="selectedClassId">
                <option v-for="clazz in schema.classes" :value="clazz['@id']">{{ schema.getDisplayLabel(clazz['@id']) }}</option>
            </select>
        </p>
        <LDTable :data="data" :headers="headers"/>
    </div>
</template>
