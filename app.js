const express = require('express');
const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

const requestDurationHistogram = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status'],
    buckets: [0.1, 0.5, 1, 1.5], // Customize your buckets as needed
});

register.registerMetric(requestDurationHistogram);

client.collectDefaultMetrics({
    app: 'node-application-monitoring-app',
    prefix: 'node_',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register
});




app = express();
const cors = require('cors');
//const dbService = require('./database');
//const pool = require("./db")
const usersRoutes = require('./routes/users');
const interestsRoutes = require('./routes/interests')

// Middleware to record request duration
app.use((req, res, next) => {
    const endTimer = requestDurationHistogram.startTimer({
        method: req.method,
        route: req.path,
    });
    res.on('finish', () => {
        endTimer({ status: res.statusCode });
    });
    next();
});

//app.use(requestMethod)
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 3000
app.listen(PORT, ()=> {
    console.log('server is running on Port: %d metrics are on /metrics',PORT)
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


