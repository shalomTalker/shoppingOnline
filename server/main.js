console.clear();
//express
const express = require('express');
const app = express();
const PORT = 3000;
//web socket
const websocket = require('http').Server(app);
const io = require('socket.io')(websocket);
//auth
const checkAuth = require('./middlewares/jwt');


// CORS 
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.status(200).end();
    } else {
        next();
    }
});

// body parser
const filter = require('content-filter');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(filter());

// request dump debug
app.use((req, res, next) => {
    if (req.originalUrl == '/favicon.ico') {
        next();
    } else {
        console.log('>', req.method, req.originalUrl);
        if (Object.entries(req.body).length) {
            console.log('Posted:');
            console.log(req.body);
            console.log("\n");
        }
        next();
    }
});

//websocket
io.on('connection', (socket) => {
    socket.on('dataSend', (message) => {
        io.emit('dataSend', {
            data: message
        });
    });
});

// mongoose
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/store', {
    useNewUrlParser: true
});
mongoose.connection.on('error', (e) => console.log('Db Connect Error:', e));
mongoose.connection.on('connected', () => {
    console.log('Db Connected to:', mongoose.connection.name);
    // start server since db is properly connected
    app.listen(PORT, () => {
        console.log(`Node listening on localhost:${PORT}`);
    });
    //web socket
    websocket.listen(4000, () => {
        console.log(`WebSocket listening on localhost:4000`);
    });
});

// routing
app.use('/users', require('./routes/users.route'));
app.use('/products', require('./routes/products.route'));
app.use('/cart', checkAuth, require('./routes/cart.route'));
app.use('/order', require('./routes/order.route'));
app.use('/images', express.static( "../uploads" ));

// return error if got here with no valid route
app.use('**', (req, res) => {
    console.log('Unknown request');
    res.status('404').send("404 Unknown Request");
});