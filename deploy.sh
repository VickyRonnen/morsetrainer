#!/bin/bash
DOMAIN=pa5wpm.nl
npm run build -- -c production || exit 1

ssh root@pa5wpm.nl 'apt install -y apache2'
ssh root@pa5wpm.nl 'sudo a2enmod ssl rewrite'

scp /home/vicky/strato/pa5wpm/cert_pa5wpm.crt root@pa5wpm.nl:/etc/ssl/certs
scp /home/vicky/strato/pa5wpm/full_pa5wpm.crt root@pa5wpm.nl:/etc/ssl/certs
scp /home/vicky/strato/pa5wpm/pa5wpm.key root@pa5wpm.nl:/etc/ssl/private

ssh root@pa5wpm.nl rm -rf /var/www/$DOMAIN
ssh root@pa5wpm.nl mkdir -p /var/www/$DOMAIN
scp -r dist/morsetrainer/browser/* root@pa5wpm.nl:/var/www/$DOMAIN
scp strato/100-pa5wpm.nl.conf root@pa5wpm.nl:/etc/apache2/sites-available
ssh root@pa5wpm.nl a2ensite 100-pa5wpm.nl.conf
ssh root@pa5wpm.nl 'apachectl -t' && echo OK || echo ERROR
ssh root@pa5wpm.nl systemctl reload apache2
