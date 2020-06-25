FROM epmlsop/indigo_service

# Add and build Ketcher
WORKDIR /tmp
RUN \
# Install Node.js
    apt-get update \
 && apt-get install -y curl \
 && curl -sL http://deb.nodesource.com/setup_10.x | bash \
 && apt-get install -y \
    bzip2 \
    nodejs \
# Download sources
 && curl -sL http://github.com/epam/ketcher/archive/2.0.0-RC.tar.gz -o /tmp/ketcher.tar.gz \
 && curl -sL http://github.com/epam/miew/archive/v0.7.13.tar.gz -o /tmp/miew.tar.gz \
# Build production Ketcher files
 && tar -xf /tmp/ketcher.tar.gz \
 && tar -xf /tmp/miew.tar.gz \
 && cd ketcher-2.0.0-RC \
 && npm install \
 && npm run build -- --api-path=/v2/ --miew-path=/tmp/miew-0.7.13/dist \
 && mv /tmp/ketcher-2.0.0-RC/dist /srv/ketcher \
 && mv /tmp/miew-0.7.13/dist/Miew.min.* /srv/ketcher \
# Cleanup
 && apt-get purge -y \
        apt-transport-https \
        bzip2 \
        curl \
        gnupg \
        lsb-release \
        nodejs \
 && apt-get autoremove -y \
 && rm -rf \
        /tmp/ketcher.tar.gz \
        /tmp/ketcher-2.0.0-RC \
        /tmp/miew.tar.gz \
        /tmp/miew-0.7.13 \
        /tmp/phantomjs \
        /tmp/npm* \
        /etc/apt/sources.list.d/nodesource.list \
        /var/lib/apt/lists/*

# Add Nginx
WORKDIR /tmp
RUN \
# Install Nginx
    apt-get update \
 && apt-get install -y nginx \
# Set Nginx to run as root
 && sed -i s/"user www-data"/"user root"/g /etc/nginx/nginx.conf \
# Set uWSGI to use a socket file
 && sed -i s/"socket = :8002"/"socket = \/tmp\/uwsgi.sock"/g /etc/uwsgi.ini \
# Add Nginx configuration
 && echo 'upstream indigo {\n\
    server unix:///tmp/uwsgi.sock;\n\
}\n\
server {\n\
    listen 8002 default_server;\n\
    server_name _;\n\

    access_log /dev/stdout;\n\
    charset utf-8;\n\
    client_max_body_size 75M;\n\

    add_header "Access-Control-Allow-Origin" "*" always;\n\
    add_header "Access-Control-Allow-Methods" "POST, GET, PUT, DELETE, OPTIONS" always;\n\
    add_header "Access-Control-Allow-Headers" "Accept, Content-Type" always;\n\
    add_header "Access-Control-Max-Age" "86400" always;\n\

    location / {\n\
        root /srv/ketcher;\n\
        index ketcher.html;\n\
    }\n\
    location /v2 {\n\
        include uwsgi_params;\n\
        uwsgi_pass indigo;\n\
    }\n\
}' > /etc/nginx/sites-enabled/default \
# Add supervisord start
 && echo '[program:nginx]\n\
directory=/srv\n\
command=/usr/sbin/nginx -g "daemon off;"\n\
autostart=true\n\
autorestart=true\n\
startsecs=0\n\
redirect_stderr=true\n\
stdout_logfile=/dev/stdout\n\
stdout_logfile_maxbytes=0' > /etc/supervisor/conf.d/nginx.auto.conf \
# Cleanup
 && rm -rf /var/lib/apt/lists/*

# Patch Ketcher to import/export
COPY ketcher.html /srv/ketcher/ketcher.html

WORKDIR /srv/api
VOLUME /tmp/indigo-service/upload
EXPOSE 8002
