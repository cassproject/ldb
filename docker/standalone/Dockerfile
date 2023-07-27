FROM docker.elastic.co/elasticsearch/elasticsearch:8.6.2

USER root
RUN curl -sL https://deb.nodesource.com/setup_19.x | bash -
RUN DEBIAN_FRONTEND=noninteractive TZ=Etc/UTC apt install -qqy nodejs && apt upgrade -qqy && apt clean

USER elasticsearch
RUN mkdir ldb && ln -s ldb CASS
COPY src ldb/src
COPY package.json ldb/package.json
COPY ca.crt ldb/ca.crt
COPY ldb.crt ldb/ldb.crt
COPY ldb.key ldb/ldb.key
COPY pm2.config.js ldb/pm2.standalone.config.js
COPY copyright.txt ldb/copyright.txt
COPY LICENSE ldb/LICENSE
RUN cd ldb && npm install --production --omit=dev && npm upgrade --production --omit=dev --save && npm audit --production --audit-level=high fix

USER root
RUN echo 'node.name: cass-a' >> config/elasticsearch.yml
RUN echo 'cluster.initial_master_nodes:' >> config/elasticsearch.yml
RUN echo '  - cass-a' >> config/elasticsearch.yml
RUN echo '-Xms2g' >> config/jvm.options
RUN echo '-Xmx2g' >> config/jvm.options
ENV xpack.security.enabled=false
ENV xpack.security.http.ssl.enabled=false
ENV xpack.security.transport.ssl.enabled=false
EXPOSE 80
VOLUME ["/usr/share/elasticsearch/data","/usr/share/elasticsearch/ldb/etc","/usr/share/elasticsearch/ldb/logs"]

USER elasticsearch
RUN mkdir ldb/etc
RUN mkdir ldb/logs

USER root
RUN mkdir /logs
RUN chown -R elasticsearch:root /logs

USER elasticsearch:root
ENTRYPOINT (cd ldb && npm run run:standalone && npm run logs) & /bin/tini -- /usr/local/bin/docker-entrypoint.sh