import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as jsonld from 'jsonld';

class SchemaNamespace{
  constructor(props){
    for (let prop in props)
      this[prop] = props[prop];
    let g = this["@graph"];
    for (let entry of g)
    {
      for (let type of entry["@type"])
      {
        if (this[type] == null)
          this[type] = {};
        this[type][entry["@id"]] = builder(entry);
      }
    }
    this.properties = {...this["http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"]};
    this.classes = {...this["http://www.w3.org/2000/01/rdf-schema#Class"]};

    for (let className in this.classes)
    {
      let clazz = this.classes[className];
      
      if (clazz["http://www.w3.org/2000/01/rdf-schema#subClassOf"] != null)
      for (let parentObj of clazz["http://www.w3.org/2000/01/rdf-schema#subClassOf"])
      {
        let parent = parentObj["@id"];
        if (this.classes[parent] != null)
        {
          if (this.classes[parent].subClasses == null)
            this.classes[parent].subClasses = {};
          this.classes[parent].subClasses[clazz["@id"]] = clazz;
        }
        if (this.classes[clazz["@id"]] != null)
        {
          this.classes[clazz["@id"]].superClass = this.classes[parent];
        }
      }
    }
    for (let propName in this.properties)
    {
      let prop = this.properties[propName];
      if (prop["http://schema.org/domainIncludes"] != null)
      for (let domainObj of prop["http://schema.org/domainIncludes"])
      {
        let domain = domainObj["@id"];
        if (this.classes[domain] != null)
        {
          if (prop["http://schema.org/rangeIncludes"] != null)
          for (let rangeObj of prop["http://schema.org/rangeIncludes"])
          {
            let range = rangeObj["@id"];
            if (this.classes[range] != null)
            {
              if (this.classes[domain].properties == null)
                this.classes[domain].properties = {};
              this.classes[domain].properties[prop["@id"]] = prop;
              if (this.classes[range].inProperties == null)
                this.classes[range].inProperties = {};
              this.classes[range].inProperties[prop["@id"]] = prop;
              if (prop.inClasses == null)
                prop.inClasses = {};
              prop.inClasses[this.classes[domain]["@id"]] = this.classes[domain];
            }
          }
        }
      }
    }
  }
}

let builder = function(thing){
  if (thing["@type"].includes("http://www.w3.org/1999/02/22-rdf-syntax-ns#Property"))
    return new SchemaProperty(thing);
  if (thing["@type"].includes("http://www.w3.org/2000/01/rdf-schema#Class"))
    return new SchemaClass(thing);
  return thing;
}

class SchemaClass{
  constructor(props){
    for (let prop in props)
      this[prop] = props[prop];
  }
  getDisplayName = ()=>{
    if (this["http://www.w3.org/2000/01/rdf-schema#label"] != null)
      return this["http://www.w3.org/2000/01/rdf-schema#label"][0]["@value"];
    return this["@id"];
  }
  getDescriptionLabel = ()=>{
    if (this["http://www.w3.org/2000/01/rdf-schema#comment"] != null)
      return this["http://www.w3.org/2000/01/rdf-schema#comment"][0]["@value"];
    return "";
  }
}

class SchemaProperty{
  constructor(props){
    for (let prop in props)
      this[prop] = props[prop];
  }
  getDisplayName = ()=>{
    if (this["http://www.w3.org/2000/01/rdf-schema#label"] != null)
      return this["http://www.w3.org/2000/01/rdf-schema#label"][0]["@value"];
    return this["@id"];
  }
  getDescriptionLabel = ()=>{
    if (this["http://www.w3.org/2000/01/rdf-schema#comment"] != null)
      return this["http://www.w3.org/2000/01/rdf-schema#comment"][0]["@value"];
    return "";
  }
}

export const schemaStore = defineStore('schema', () => {

  let out = {};
  out.count = ref(0)
  out.doubleCount = computed(() => out.count.value * 2)
  out.increment = ()=>{
    out.count.value++
  }

  out.jsonld = ref({});
  out.ns = ref({});
  out.fetched = ref({});
  out.classes = ref({});
  out.properties = ref({});
  out.ingestSchema = async (source,jld)=>{
    let expanded = await jsonld.expand(jld);
    expanded = expanded[0];
      out.jsonld.value[source] = expanded;
      let ns = out.ns.value[source] = new SchemaNamespace(expanded);
      for (let n in ns.classes)
        out.classes.value[n] = ns.classes[n];
      for (let n in ns.properties)
        out.properties.value[n] = ns.properties[n];
  }
  out.fetchSchema = async (url)=>{
    if (out.fetched.value[url] != null) 
      return;
    out.fetched.value[url] = true;
    let schema = await (await fetch(url)).json();
    await out.ingestSchema(schema["@id"],schema);
  }
  out.getDisplayLabel = (url)=>{
    for (let n in out.ns.value)
    {
      console.log(n);
      if (out.ns.value[n].classes[url] != null) 
      {
        console.log(out.ns.value[n].classes[url]);
        return out.ns.value[n].classes[url]["http://www.w3.org/2000/01/rdf-schema#label"][0]["@value"];
      }
      if (out.ns.value[n].properties[url] != null) 
        return out.ns.value[n].properties[url]["http://www.w3.org/2000/01/rdf-schema#label"][0]["@value"];
    }
  }
  out.getDescriptionLabel = (url)=>{
    for (let n in out.ns.value)
    {
      console.log(n);
      if (out.ns.value[n].classes[url] != null) 
      {
        console.log(out.ns.value[n].classes[url]);
        return stripHtml(out.ns.value[n].classes[url]["http://www.w3.org/2000/01/rdf-schema#comment"][0]["@value"]);
      }
      if (out.ns.value[n].properties[url] != null) 
        return stripHtml(out.ns.value[n].properties[url]["http://www.w3.org/2000/01/rdf-schema#comment"][0]["@value"]);
    }
  }

  return out;
})

//strip html from string 
export const stripHtml = (html) => {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}