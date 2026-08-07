#!/bin/bash
DOMAIN=pa5wpm.nl
ng build -c production|| exit 1
ssh root@pa5wpm.nl rm -rf /var/www/$DOMAIN
ssh root@pa5wpm.nl mkdir -p /var/www/$DOMAIN
scp -r dist/morsetrainer/browser/* root@pa5wpm.nl:/var/www/$DOMAIN
#scp .htaccess root@pa5wpm.nl:/var/www/vhosts/$DOMAIN
