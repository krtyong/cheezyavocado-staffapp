import mqtt from 'mqtt'

var options = {
  port: 37267,
  host: "wss://soldier.cloudmqtt.com",
  clientId: "mqttjs_" + Math.random().toString(16).substr(2, 8),
  username: "vfmquhui",
  password: "yXMUCDc8eoO8",
  keepalive: 60,
  reconnectPeriod: 1000,
  protocolId: "MQIsdp",
  protocolVersion: 3,
  clean: true,
  encoding: "utf8",
};



export default mqtt.connect("wss://soldier.cloudmqtt.com", options)