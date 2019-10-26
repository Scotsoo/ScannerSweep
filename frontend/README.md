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

### Setup basic tools and screen
```
sudo ./deploy/raspi_setup.sh
````

### Deploy the service
```
 sudo cp ./scanner.service /etc/systemd/system/
 ```

 ### Check Status of Service
```
sudo systemctl status scanner
```

### Restart Service
```
sudo systemctl restart scanner
```
