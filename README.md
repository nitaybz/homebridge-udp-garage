# homebridge-udp-garage
Control your garage door through UDP packets


# config.json

```
{
        "accessory": "garageDoor",
        "name": "My Garag Door",
        "host": "192.168.0.X",
        "port": 80,
        "garage_open_payload": "874652395hjui4d98523",
        "garage_close_payload": "8932y4123545j5k245325"
}
```

## Configuration Params

|             Parameter            |                       Description                       | Required |
| -------------------------------- | ------------------------------------------------------- |:--------:|
| `name`                           | name of the accessory                                   |     ✓    |
| `host`                           | endpoint for whatever is receiving these requests       |     ✓    |
| `port`                           | port of destination                                     |     ✓    |
| `garage_open_payload`            | payload for the open state                              |     ✓    |
| `garage_close_payload`           | payload for the close state                             |     ✓    |

## Help

  - Make sure to specify a port and host in the config file.

## Installation

1. Install homebridge using: `npm install -g homebridge`
2. Install this plugin using: `npm install -g homebridge-udp-garage`
3. Update your config file
