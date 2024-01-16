import * as mqtt from 'mqtt'
import mysql from 'mysql2/promise'

const client = mqtt.connect('mqtt://172.20.10.2:1883')
// const client = mqtt.connect('mqtt://172.20.10.7:1883')

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "1312002",
  database: "iot",
};
// insert nhiệt độ, độ ẩm, ánh sáng vào db
async function handleMessage(message) {
  try {
    const [temperature, humidity, light] = message.toString().split(',');
    
    const now = new Date();
    now.setMinutes(now.getMinutes() + 7*60);
    const currentDate = now.toISOString().slice(0, 19).replace('T', ' ');

    const connection = await mysql.createConnection(dbConfig);

    // insert
    const [rows] = await connection.execute(
      'INSERT INTO data (date, temperature, humidity, light) VALUES (?, ?, ?, ?)',
      [currentDate, temperature, humidity, light]
    );

    console.log('Data inserted into MySQL:', rows);

    connection.end();
  } catch (error) {
    console.error('Error inserting data into MySQL:', error);
  }
}
// connect mqtt
client.on('connect', function() {
  console.log('MQTT client connected');
  client.subscribe('esp/sensor', (err) => {
    if (err) {
      console.log('subscribe error:', err)
      return
    }
    console.log('Subscribed to topic esp/sensor')
  })
});

client.on('message', function(topic, payload) {
  console.log('Received data from topic "' + topic + '": ' + payload.toString());
  handleMessage(payload);
});

client.on('close', function() {
  console.log('MQTT connection closed, now exiting.');
  process.exit(0);
});

export function publishMessage(topic, message) {
  client.publish("esp/"+topic, message , { qos: 0, retain: false }, (error) => {
    if (error) {
      console.error(error)
    }
  });
  console.log(`Message published to ${topic}: ${message}`);
};
