# WebSocket Client Instance Manager

Kind of like a mutant in-between a boilerplate and a framework for building multi-user WebSocket applications over several client instances.

# Installation

### Development

* `npm install`
* `npm run dev` runs the development environment using webpack-dev-server + hot reload

### Deployment

* `npm run dist` builds the production distribution package for JS, CSS and other assets
* `npm run start` start-up script

# Requests And Responses

### Query User

###### Request
```js
socket.emit('query', data)
```
```json
data = {
  "type": "user"
}
```
###### Response
```js
socket.on('query', callback)
```
```json
{
  "type": "user",
  "data": {
    "name": "Nyan"
  }
}
```

### Query ClientInstance
###### Request
```js
socket.emit('query', data)
```
```json
data = {
  "type": "instance",
  "id"  : "QWERTY"
}
```
###### Response
```js
socket.on('query', callback)
```
```json
{
  "type": "instance",
  "data": {
    "id"    : "QWERTY",
    "status": "waiting",
    "users" : {}
  }
}
```

### Join
###### Request
```js
socket.emit('join', data)
```
```json
data = {
  "id": "QWERTY"
}
```
###### Response
```js
socket.on('query', data)
```

### Leave
###### Request
```js
socket.emit('leave', data)
```
```json
data: {
  "id": "QWERTY"
}
```
###### Response
```js
socket.on('query', data)
```
