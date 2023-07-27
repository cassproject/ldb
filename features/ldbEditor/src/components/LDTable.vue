<script setup>
import { ref, reactive, watch } from 'vue'
import { schemaStore } from "@/stores/schema";
const schema = await schemaStore();

const props = defineProps({
    data: {
        type: Array,
        required: true,
    },
    headers: {
        type: Array,
        required: true,
    }
})

const emit = defineEmits(['changed', 'deleted', 'created', 'selected', 'changedConfiguration'])

//Expand the data so we can use the schema to look up values.
let expandedData = ref([]);
let selectedHeaders = ref([]);
let go = async (first, second) => {
    let jld = first.map((d) => d.toJson != null ? JSON.parse(d.toJson()) : d);
    expandedData.value = await schema.expand(jld);
    selectedHeaders.value = [...props.headers];

    //Count the number of times each property in the object exists.
    let propCount = {};
    for (let header of selectedHeaders.value) {
        if (propCount[header['@id']] === undefined)
            propCount[header['@id']] = 0;
        for (let datum of expandedData.value)
            if (datum[header['@id']] !== undefined)
                propCount[header['@id']]++;
    }

    //Sort the headers by the number of times they appear in the data.
    selectedHeaders.value.sort((a, b) => {
        return propCount[b["@id"]] - propCount[a["@id"]];
    })

    //Remove headers that don't appear in the data.
    for (let i = 0; i < selectedHeaders.value.length; i++) {
        if (propCount[selectedHeaders.value[i]['@id']] === 0) {
            selectedHeaders.value.splice(i, 1);
            i--;
        }
    }

};

watch(props.data, go);
watch(props.headers, go);

await go(props.data);

let change = (datum,header,index,event)=>{
    let value = event.target.innerText;
    if (value.length == 0)
        return remove(datum,header,index,event);
    datum[header['@id']][index]['@value'] = value;
    emit('changed',datum);
    event.target.blur();
    event.preventDefault();
}

let remove = (datum,header,index,event)=>{
    datum[header['@id']].splice(index,1);
    if (datum[header['@id']].length == 0)
        delete datum[header['@id']];
    emit('changed',datum);
    event.target.blur();
    event.preventDefault();
}

let addValue = (datum,header,index,event)=>{
    if (datum[header['@id']] === undefined)
        datum[header['@id']] = [];
    datum[header['@id']].push({"@value":"New "+header.getDisplayName()});
    emit('changed',datum);
    console.log(datum);
}

let maxCells = ref(3);
let exempt = reactive({});

let getCells = (datum,header)=>{
    if (datum[header['@id']] === undefined)
        return [];
    if (exempt[datum['@id']+header['@id']] === undefined)
        return datum[header['@id']].slice(0, maxCells.value+1);
    return datum[header['@id']];
}

let overflowed = (datum,header)=>{
    if (datum[header['@id']] === undefined)
        return false;
    return datum[header['@id']].length > maxCells.value+1;
}

let toggleExempt = (datum,header)=>{
    if (exempt[datum['@id']+header['@id']] === undefined)
        exempt[datum['@id']+header['@id']] = true;
    else
        delete exempt[datum['@id']+header['@id']];
}

</script>

<template>
    <section>
        <header>
            <div class="col"><button @click="maxCells = ((maxCells + 1) % 4)">&lt;&gt;</button></div>
            <div class="col" v-for="header in selectedHeaders" v-bind:key="header['@id']" :title="header['@id']+': '+header.getDescriptionLabel()">{{header.getDisplayName()}}</div>
        </header>
        <div class="line-break"></div>
        <template v-for="datum in expandedData" v-bind:key="datum['@id']">
            <div class="row">
                <div class="col handle" :title="datum['@id']"><span>.</span></div>
                <div class="col" v-for="header in selectedHeaders" v-bind:key="header['@id']">
                    <span class="cell" v-if="exempt[datum['@id'] + header['@id']]" contenteditable v-for="(field, index) in getCells(datum, header)" @keydown.enter="change(datum, header, index, $event)">
                        {{ field["@value"] }}
                        <span v-if="field['@language']" class="tag right">{{ field["@language"] }}</span>
                    </span>
                    <span class="cell" v-else contenteditable v-for="(field, index) in getCells(datum, header)" @keydown.enter="change(datum, header, index, $event)">
                        {{ field["@value"] }}
                        <span v-if="field['@language']" class="tag right">{{ field["@language"] }}</span>
                    </span>
                    <button class="overflowed" v-if="overflowed(datum, header)" @click="toggleExempt(datum, header)">...</button>
                </div>
            </div>
            <div class="row">
                <div class="col"></div>
                <div class="col" v-for="header in selectedHeaders" v-bind:key="header['@id']">
                    <button class="addValue" @click="addValue(datum,header,index,$event)">+</button>
                </div>
            </div>
        </template>
    </section>
</template>

<style>

section {
  display: table;
  width: 100%;
}

section > * {
  display: table-row;
}

section > span > * {
  display: table-row;
}

section .col {
  display: table-cell;
    padding: 0.5em;
    border: 1px solid white;
}

.handle
{
  writing-mode: vertical-rl;
  text-orientation: upright;
}
.cell{
    display:block;
}

.addValue{
    float:right;
}
.overflowed{
    float:right;
}
.tag{
    display:inline-block;
    padding-left:0.5em;
    padding-right:0.5em;
    border-radius:0.5em;
    background-color:peru;
    color:black;
}
.right{
    float:right;
}
</style>

