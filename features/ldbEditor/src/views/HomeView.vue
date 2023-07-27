<script setup>
import Repo from '../components/Repo.vue'

import { schemaStore } from "@/stores/schema";
const schema = await schemaStore();
// await schema.fetchSchema('http://schema.org/','schemaorg-all-http.jsonld');
// await schema.fetchSchema('https://schema.org/', 'schemaorg-all-https.jsonld');

</script>

<template>
    <div>
    <!-- main content -->
      <Repo server="http://localhost/api/" />
    </div>
</template>
