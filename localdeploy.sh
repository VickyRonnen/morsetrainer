#!/bin/bash
set -x
npm run build -- -c production|| exit 1
sudo rm -rf /var/www/pa5wpm
sudo mkdir -p /var/www/pa5wpm
sudo cp -r dist/morsetrainer/browser/* /var/www/pa5wpm
sudo cp local/pa5wpm.pc.test.conf /etc/httpd/conf.d/
sudo chown root:root /etc/httpd/conf.d/pa5wpm.pc.test.conf
sudo systemctl reload httpd
sudo ls -al /var/www/pa5wpm
sudo ls -al /etc/httpd/conf.d/pa5wpm.pc.test.conf
