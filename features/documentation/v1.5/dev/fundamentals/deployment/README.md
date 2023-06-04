# Deployment

Here, we'll go into detail about everything to do with deploying for production.

LDB is both horizontally and vertically scalable, as well as highly resilient. It can be deployed on Windows or Linux platforms in single server environments, behind multiple load balanced servers or Virtual Machines.

## Application Server

LDB may be deployed with any Node.js process manager. **PM2** is the default process manager provided with an installation. LDB Application Servers are mostly stateless, with the exception of security credentials, which must be reachable from the working directory of the servlet container.

LDB generates several files upon startup and first use of adapters and features. As such, it is recommended that the user running the servlet container be allowed to modify the working directory of the servlet container.

## Database Scalability

LDB uses ElasticSearch as a search engine and object store.

ElasticSearch is **Vertically Scalable** with
* Processors
* Memory
* I/O

ElasticSearch is **Horizontally Scalable** by defining clusters. Consult the [ElasticSearch Documentation](https://www.elastic.co/guide/index.html) to perform these operations.

:::warning
Do not configure ElasticSearch to accept connections from the outside web, as this may expose encrypted information that is intended to be private.
:::

## Web Server Proxy/Load Balancing

LDB is intended to be built with an application server (*PM2/Node*), and a database (*ElasticSearch*).

## General Security

LDB uses two major layers of security:
1. **Per-Object Security** - The application that creates the data uses encryption to protect data from use by anyone, including the server owner
2. **Server Security** - Signed requests must be provided for the server to return encrypted information

This two-layer strategy is called "**No Knowledge**" Security or Privacy. It ensures the protection of a user’s data by having the server require both authentic requests to return data and mechanisms to decrypt the data that are not available on the server. This means that, by design, your server may store data that you cannot access. This creates some complexity with search, so it is additionally possible to store data with only server security (by setting the 'reader' property of the object).