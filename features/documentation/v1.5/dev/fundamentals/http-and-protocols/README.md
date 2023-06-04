# HTTP(s), Protocols

It is recommended that LDB repositories serve resources in a secure fashion using SSL certificates.

## Default Installation Configuration

LDB has the following endpoints exposed by default:

| **Port** | **Service**       | **Notes**                                             |
|----------|-------------------|-------------------------------------------------------|
| 80/443   | PM2/Node          | Runs the LDB Repo                                     |
| 9200     | ElasticSearch     | Only responds to localhost                            |

## HTTPS

The default installation method of LDB is compatible with [LetsEncrypt](https://letsencrypt.org/), a project to provide SSL certificates to anyone. *It is recommended to create a cron job to renew your LetsEncrypt certificate.*

Other certificate providers are also supported. Configuration of the server should be done according to the certificate provider instructions.

## WebSockets

LDB allows for websocket connections. When connected, LDB will echo the identifier for any object that has been updated to all connected websockets.

This allows for
* Smarter applications that can update themselves when new data has been saved to the repository
* Software that monitors LDB and performs some operation when data is updated, such as search aggregators