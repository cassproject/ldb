<script setup>
import { ref } from 'vue'
import LDTable from '../components/LDTable.vue'

import { schemaStore } from "@/stores/schema";
const schema = await schemaStore();
await schema.fetchSchema('http://schema.org/', 'schema.jsonld');
// await schema.fetchSchema('https://schema.org/', 'schemaorg-all-https.jsonld');
await schema.fetchSchema('http://schema.cassproject.org/0.3', 'http://schema.cassproject.org/0.3');

let data = ref([
    {
        "@schema": "http://schema.org/",
        "@id": "http://example.com/1",
        "@type": "http://schema.org/Thing",
        "http://schema.org/name": [
            {
                "@language": "en-us",
                "@value": "Thing 1"
            },
            {
                "@language": "en-gb",
                "@value": "This is Thing 1"
            }
        ],
        "http://schema.org/description": [
            {
                "@language": "en-us",
                "@value": "This is a thing."
            },
            {
                "@language": "en-gb",
                "@value": "This is a very very very long thing, Lawrence. Oh my, this is quite long indeed. What is this thing."
            }
        ]
    },
    {
        "@id": "http://example.com/2",
        "@type": "http://schema.org/Thing",
        "http://schema.org/name": [
            {
                "@value": "Thing 2"
            }
        ],
        "http://schema.org/description": [
            {
                "@value": "This is another thing."
            }
        ]
    }
]);

let headers = Object.values(schema.classes["http://schema.org/Thing"].properties);
console.log(headers,data);

</script>

<template>
    <div>
        <!-- main content -->
        <LDTable :data="data" :headers="headers"/>
    </div>
</template>
