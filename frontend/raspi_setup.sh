## Run this with sudo

## Rotate the screen 90 degrees
cp /boot/config.txt /boot/config.txt.bak
sed -i '/dtoverlay/c\dtoverlay=tft35a:rotate=0' /boot/config.txt

## Install node
mkdir /opt/downloads
##mkdir /usr/local/node-v12.7.0
wget https://nodejs.org/dist/v12.7.0/node-v12.7.0-linux-armv7l.tar.gz -O /opt/downloads/node-v12.7.0.tar.gz
tar -xzf /opt/downloads/node-v12.7.0.tar.gz -C /opt/downloads
cp -R /opt/downloads/node-v12.7.0-linux-armv7l/* /usr/local/

## Add serve utility - used for starting the application
npm install -g serve

## Setup deploy location
mkdir /usr/local/bin/scanner
cd /usr/local/bin/scanner
git init
git remote add origin https://github.com/Scotsoo/ScannerSweep.git
git fetch origin
git checkout origin/frontend -- frontend
cd frontend
npm install

## Open application on startup
echo "chromium-browser --kiosk --ignore-certificate-errors --disable-restore-session-state --app=http://localhost:8080" >> /etc/xdg/lxsession/LXDE-pi/autostart
