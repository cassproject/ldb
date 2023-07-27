import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as jsonld from 'jsonld';
import {JsonLdDocumentLoader} from 'jsonld-document-loader';

class SchemaNamespace{
  constructor(props){
    for (let prop in props)
      this[prop] = props[prop];
    let g = this["@graph"];
    for (let entry of g)
    {
      if (entry["@type"] == null) continue;
      for (let type of entry["@type"])
      {
        if (this[type] == null)
          this[type] = {};
        if (entry["@id"] == null) continue;
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
  out.fetched = {};
  out.classes = ref({});
  out.properties = ref({});
  out.ingestSchema = async (source,jld)=>{
    let expanded = await jsonld.expand(jld);
    //Named space.
    if (jld["@id"] != null)
      expanded = expanded[0];
    else
      expanded = {"@graph":expanded,"@id":source};
    out.jsonld.value[source] = expanded;
    let ns = out.ns.value[source] = new SchemaNamespace(expanded);
    for (let n in ns.classes)
      out.classes.value[n] = ns.classes[n];
    for (let n in ns.properties)
      out.properties.value[n] = ns.properties[n];
  }
  out.fetchSchema = async (name,url)=>{
    if (out.fetched[url] != null) 
      return;
    let schema = out.fetched[name] = out.fetched[url] = await (await fetch(url)).json();
    await out.ingestSchema(name || schema["@id"],schema);
  }
  out.getDisplayLabel = (url)=>{
    if (EcObject.isObject(url)) url = url['@id'];
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
    return url;
  }
  out.getDescriptionLabel = (url)=>{
    if (EcObject.isObject(url)) url = url['@id'];
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
    return url;
  }
  out.expand = async (jld)=>{
    return await jsonld.expand(jld);
  }

  jsonld.documentLoader = async function(url) {
      if (url in out.fetched) {
          return {
              contextUrl: null, // this is for a context via a link header
              document: out.fetched[url], // this is the actual document that was loaded
              documentUrl: url // this is the actual context URL after redirects
          };
      } else {
          console.log("Custom document loader..." + url);
          await out.fetchSchema(url,url); 
          return {
              contextUrl: null, // this is for a context via a link header
              document: out.fetched[url], // this is the actual document that was loaded
              documentUrl: url // this is the actual context URL after redirects
          };
      }
  };

  return out;
})

//strip html from string 
export const stripHtml = (html) => {
  var tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}
