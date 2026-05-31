#!/bin/sh
set -eu

cert_dir="/etc/letsencrypt/live/${PUBLIC_DOMAIN}"
template_dir="/opt/nginx/templates"
output_dir="/etc/nginx/templates"

mkdir -p "${output_dir}"

if [ -f "${cert_dir}/fullchain.pem" ] && [ -f "${cert_dir}/privkey.pem" ]; then
    cp "${template_dir}/https.conf.template" "${output_dir}/default.conf.template"
else
    cp "${template_dir}/http.conf.template" "${output_dir}/default.conf.template"
fi