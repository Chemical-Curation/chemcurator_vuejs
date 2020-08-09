FROM hub.chemaxon.com/cxn-docker-release/chemaxon/mjs-webservice
ARG lic="US Env Lic.cxl"
ARG mjs="US Env Lic MJS.cxl"
ARG mrk="US Env Lic Markush E.cxl"
ARG target="/home/cxnapp/.chemaxon/licenses/"
COPY ${lic} ${target}
COPY ${mjs} ${target}
COPY ${mrk} ${target}
COPY editorws.html /app/mjs-webservice/static/editorws.html
