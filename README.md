# YAML Generator for Loadbalancing and Port Routing
This Visual Generator create a *docker-compose.yml* and a *rancher-compose.yml* file. It helps to setup fast and secure a Infrastructure with a Rancher(Cattle) Masternode.

## The Generator uses 4 diffrent Docker Images:
- [x] placeholder-webpage-docker | [github.com](https://github.com/a6b8/placeholder-webpage-docker) | [hub.docker.com](https://hub.docker.com/r/a6b8/placeholder-webpage-docker/)
- [x] redirect-to-https-docker | [github.com](https://github.com/a6b8/redirect-to-https-docker) | [hub.docker.com](https://hub.docker.com/r/a6b8/redirect-to-https-docker/)
- [x] redirect-to-url-docker | [github.com](https://github.com/a6b8/redirect-to-url-docker) | [hub.docker.com](https://hub.docker.com/r/a6b8/redirect-to-url-docker/)
- [x] rancher/lb-service-haproxy | [hub.docker.com](https://hub.docker.com/r/rancher/lb-service-haproxy/)

## Features
- [x] Redirect all 80 to 443
- [x] Sets up a Placeholder Webpage
- [x] Set Rules for non-subdomain Request (example.com) and Ip-Adress Requests.

## Quickstart
HTML View: [a6b8/yaml-generator-loadbalancer](http://htmlpreview.github.io/?https://github.com/a6b8/yaml-generator-loadbalancer/blob/master/index.html)
