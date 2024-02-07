const express = require('express');
const Prometheus = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

client.collectDefaultMetrics({
    app: 'node-application-monitoring-app',
    prefix: 'node_',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register
});

const httpRequestTimer = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 7, 10] // 0.1 to 10 seconds
});

app = express();
const cors = require('cors');
//const dbService = require('./database');
//const pool = require("./db")
const usersRoutes = require('./routes/users');
const interestsRoutes = require('./routes/interests')
// app.get('/',(req,res)=> {   moved to controllers
//     res.send('hello')
// })
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> {
    console.log('Listening on Port: %d',PORT)
})
//app.use('/',require('./routes/hello.js'))
app.use('/users',usersRoutes);
app.use('/interests',interestsRoutes);

//for monitoring metrics
app.get('/metrics', async (req, res) => {
    res.setHeader('Content-Type', register.contentType);
    res.send(await register.metrics());
});

app.use((req,res)=>{ //if no response
    res.status(404).render('404',{title: '404'}); 
    console.error('404');
});


