#!/bin/bash
set -x
npm run build -- -c production|| exit 1
sudo rm -rf /var/www/pa5wpm
sudo mkdir -p /var/www/pa5wpm
sudo cp -r dist/morsetrainer/browser/* /var/www/pa5wpm
sudo systemctl daemon-reload
sudo systemctl reload httpd
sudo ls -al /var/www/pa5wpm
