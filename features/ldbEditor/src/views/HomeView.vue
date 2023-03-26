<script setup>
import Repo from '../components/Repo.vue'

import { schemaStore } from "@/stores/schema";
const schema = await schemaStore();
await schema.fetchSchema('schema.jsonld');

</script>

<template>
    <div>
    <!-- main content -->
      <Repo server="http://localhost/api/" />
    </div>
</template>
