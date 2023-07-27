# LDB
Linked Data dataBase (LDB) is a database layer that transforms Elasticsearch into a security-centric, web accessible linked data database.

LDB supports REST operations (GET, PUT, POST, DELETE) along with some restful bulk operations.

It's features are, primarily:

* Supports storage, retrieval, and search of Linked Data objects.

* Enforces key based security on linked data objects, automatically translated from a variety of supported SSO methods including third party key management, OAUTH2, OIDC, and Client side certificates.

* Support for HTTP2 for fast asynchronous web based operation.

* Supports object versioning, object history, and retrieval of previous versions.

* Supports encrypted data storage. (may conflict with some search requirements)

LDB is used for:

The creation of client-side applications where LDB provides access to secure or public data, with no unique support for the application. (note, in the case of SSO based authentication, LDB is generating and managing your keys)

The creation of server-side applications that want to expose their underlying data layer as linked data to prevent vendor lock in or interoperability issues.

The creation of common data registries.

