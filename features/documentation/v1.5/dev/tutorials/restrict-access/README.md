# Restrict Access

On the topic of security, you may opt to restrict who, or what systems, can access a CaSS Repository. CaSS supports several options for this:

1. IP address whitelisting
2. Client-Side Certificates
3. Identity restrictions (e.g. only users with at least two identities)
4. Using [OpenID Connect](https://openid.net/connect/)
5. Using [JSON Web Tokens (JWT's)](https://jwt.io/)

## IP Address Whitelisting

You may restrict all requests to the CaSS server by filtering by IP address. To do this, we use the `CASS_IP_ALLOW` environment variable. For example:

```bash
CASS_IP_ALLOW=127.0.0.1,28.28.28.0/24
```

Set this variable to a comma-separated list of IP addresses you wish to permit to communicate with the server. If a request is made through an IP address not listed here, a 403 status code will be returned to the client (with the exception of certain routes).

## Client-Side Certificates

Use of client-side certificates can be enabled by setting the `REQUEST_CLIENT_SIDE_CERTIFICATE` environment variable.

Furthermore, we can set the `CLIENT_SIDE_CERTIFICATE_ONLY` variable for stricter security. This will reject requests that are made without an authorized certificate in accordance with the Certificate Authority (CA).

```bash
REQUEST_CLIENT_SIDE_CERTIFICATE=true
CLIENT_SIDE_CERTIFICATE_ONLY=true
```

## Identity Restrictions

A CaSS user may hold, or belong to, a number of identities. We may restrict access to only users who have a certain number of established identities. We use the `CASS_SSO_ACCOUNT_REQUIRED` environment variable to do this. For example, if we wish to specify only users with at least two identities:

```bash
CASS_SSO_ACCOUNT_REQUIRED=2
```

An access denial will result in a redirect to another page. To specify what page this is, we modify the `CASS_IP_DENIED_REDIRECT` environment variable. For example:

```bash
CASS_IP_DENIED_REDIRECT=/api/login
```

## OpenID Connect

CaSS supports access through [OpenID Connect](https://openid.net/connect/). You may use your preferred OpenID Connect provider, e.g. [Keycloak](https://www.keycloak.org/).

Modify the following environment variables to your current configuration. For example, for a Keycloak configuration we might use something like:

```bash
# Enables OpenID login
CASS_OIDC_ENABLED=true
# URL to redirect to after login
CASS_OIDC_BASE_URL=http://localhost/
# Points to your Keycloak realm
CASS_OIDC_ISSUER_BASE_URL=http://keycloak/auth/realms/master/
# Name of your Keycloak client
CASS_OIDC_CLIENT_ID=cass
# Secret from your Keycloak client
CASS_OIDC_SECRET=M2nn59wDxkwUZ9SVEVAJADYnUeKP78vU
```

## JSON Web Tokens (JWT's)

Enabling access through [JSON Web Tokens](https://jwt.io/) is as simple as setting the following environment variable:

```bash
CASS_JWT_ENABLED=true
```

CaSS supports further configuration with the following environment variables:

```bash
CASS_JWT_SECRET=cass
CASS_JWT_ALGORITHM=HS256
```