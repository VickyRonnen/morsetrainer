#!/bin/bash
ng build -c production|| exit 1
sudo rm -rf /var/www/pa5wpm
sudo mkdir -p /var/www/pa5wpm
sudo cp -r dist/morsetrainer/browser/* /var/www/pa5wpm
sudo cp .htaccess /var/www/pa5wpm
sudo systemctl daemon-reload
sudo systemctl reload apache2
