<script setup>
import TypeBrowser from '../components/TypeBrowser.vue'

import { schemaStore } from "@/stores/schema";
const schema = await schemaStore();
await schema.fetchSchema('schema.jsonld');

</script>

<template>
    <div>
    <!-- main content -->
      <TypeBrowser />
    </div>
</template>
