#!/bin/bash
DOMAIN=pa5wpm.nl
npm run build -- -c production || exit 1
ssh root@pa5wpm.nl rm -rf /var/www/$DOMAIN
ssh root@pa5wpm.nl mkdir -p /var/www/$DOMAIN
scp -r dist/morsetrainer/browser/* root@pa5wpm.nl:/var/www/$DOMAIN
scp strato/100-pa5wpm.nl.conf root@pa5wpm.nl:/etc/apache2/sites-available
ssh root@pa5wpm.nl a2ensite 100-pa5wpm.nl.conf
ssh root@pa5wpm.nl systemctl reload apache2
