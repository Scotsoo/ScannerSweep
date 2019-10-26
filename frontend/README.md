# example

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

## Deployment on the pi

1. copy raspi_setup.sh on to the pi and run with sudo
```
sudo ./raspi_setup.sh
````
2. Build
```
cd /usr/local/bin/scanner/frontend
sudo npm run build
```
3. Deploy the service
```
sudo cp ./scanner.service /etc/systemd/system/
```

4. Enable the service
```
sudo systemctl enable scanner
```

5. Reboot
```
sudo reboot
```

## Service management

### Check Status of Service
```
sudo systemctl status scanner
```

### Restart Service
```
sudo systemctl restart scanner
```

### Deploy latest version of the front end

```
cd /usr/local/bin/scanner
sudo git fetch origin
sudo git checkout origin/frontend -- frontend
cd frontend
sudo npm install
sudo npm run build
sudo reboot
```
