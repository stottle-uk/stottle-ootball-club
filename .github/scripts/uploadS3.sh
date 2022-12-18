#!/bin/sh

set -e

sh -c "aws s3 sync dist/apps/ootball-web s3://web-ssr-bucket-dev \
              --profile stottle \
              --acl public-read --follow-symlinks --delete"