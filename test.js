// import mysql from 'mysql2';

// const connection = await mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "2112",
//   database: "iot",
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// connection.connect((err) =>{
//     if(err) throw err;
//     console.log('connected successfully');
// });

// export default connection;


import {publishMessage} from './mqtt.js'
publishMessage('led', 'on');