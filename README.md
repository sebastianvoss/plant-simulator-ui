# Prerequisites

## Events and Telemetry Websockets

The app accesses two services using a websocket connection:
 
```
ws://localhost:8080/events?id=1
ws://localhost:8080/telemetry?id=1
```

The addresses can be configured in `src/common/Utils.tsx`

# Setup

```
npm install
npm start
```
