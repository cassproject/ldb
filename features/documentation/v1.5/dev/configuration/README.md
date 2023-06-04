# LDB Configuration

There are a number of environment variables that can be configured to change the ways that LDB behaves.

## `HTTPS`
Should LDB use HTTPS. Defaults to `false`.

## `ELASTICSEARCH_ENDPOINT`
URL for the elastic search service. Defaults to `http://localhost:9200`.

## `LOOPBACK`
URL for the LDB API. Defaults to `http://localhost/api/` or `https://localhost/api/`, depending on if https is enabled.

## `LOOPBACK_PROXY`
Optional URL for the loopback proxy. Used when the endpoint that LDB uses to talk to itself is different than how it represents itself, for example the loopback proxy may be on localhost.

## `OIDC_ENABLED`
Should LDB use OpenID Connect. Defaults to `false`.

## `OIDC_ISSUER_BASE_URL`
URL for the OpenID Connect issuer, e.g. Keycloak. Defaults to `https://dev.keycloak.eduworks.com/auth/realms/test-realm/`.

## `OIDC_CLIENT_ID`
ID of the client being used in OpenID Connect. Defaults to `ldb`.

## `OIDC_SECRET`
Secret key for the above client.

## `OIDC_BASE_URL`
Base URL for login and logout API when using OpenID Connect. Defaults to `http://localhost/`.

## `JWT_ENABLED`
Should LDB use JWT for authentication. Defaults to `false`.

## `JWT_SECRET`
Secret key for JWT. Defaults to `ldb`.

## `JWT_ALGORITHM`
JWT Algorithm to use. Defaults to `HS256`.

## `BANNER_MESSAGE`
Optional message to display in banners along the top and bottom of the LDB Editor.

## `BANNER_TEXT_COLOR`
Optional color for the banner message text. Defaults to the LDB Editor theme colors.

## `BANNER_BACKGROUND_COLOR`
Optional color for banner background. Defaults to the LDB Editor theme colors.

## `EXTERNAL_ENDPOINT`
Optional URL for a LDB instance to use as the endpoint for creating alignments/relations, instead of this LDB instance.

## `REPLICATION_ENDPOINT`
Optional URL of another LDB instance to replicate data to.

## `REPLICATION_PPK`
The key for the above replication endpoint.

## `MOTD_MESSAGE`
Optional message to display as a popup when users open the LDB Editor.

## `MOTD_TITLE`
Optional title for the above message.

## `DISABLED_ADAPTERS`
Optional comma separated list of adapters to disable in LDB. Valid options include: `asn, case, ceasn, jsonld, badge, xapi, profile`.

## `MAX_CONNECTIONS`
Optional limit on the number of concurrent connections to the LDB server. Should be an integer value.

## `LOG_FILTERED_CATEGORIES`
Optional comma separated list of logging categories to disable. Valid options include: `sys, auth, msg, fs, net, stor, adap, prof`.

## `LOG_FILTERED_SEVERITIES`
Optional comma separated list of logging severities to disable. Valid options include: `EMERGENCY, ALERT, CRITICAL, ERROR, WARNING, NOTICE, INFO, DEBUG`.

## `LOG_FILTERED_MESSAGES`
Optional comma separated list of specific log messages to disable.

## `SMTP_HOST`
Optional SMTP server to use in order to send emergency email warnings regarding the LDB instance.

## `SMTP_PORT`
Optional SMTP port for the above SMTP server. Defaults to `587`.

## `SMTP_USER`
Optional username for the above SMTP server.

## `SMTP_PASS`
Optional password for the above SMTP server.

## `SMTP_RECIPIENTS`
Optional comma separated list of email addresses which should receive email notifications from the above SMTP server.

