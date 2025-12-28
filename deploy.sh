#!/bin/bash
ng build -c production|| exit 1
ssh root@pa5wpm.nl rm -rf /var/www/vhosts/pa5wpm.nl/httpdocs/*
ssh root@pa5wpm.nl mkdir -p /var/www/vhosts/pa5wpm.nl/httpdocs
scp -r dist/morsetrainer/browser/* root@pa5wpm.nl:/var/www/vhosts/pa5wpm.nl/httpdocs
scp .htaccess root@pa5wpm.nl:/var/www/vhosts/pa5wpm.nl/httpdocs
