
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser =require('body-parser');

const  mongoose = require('mongoose');

const productRoutes = require('./api/routes/products');
const orderRoutes = require('./api/routes/order');

mongoose.connect('mongodb://dustin_barth:'+process.env.MONGO_ATLAS_PW +'@cluster0-shard-00-00-ovlat.mongodb.net:27017,cluster0-shard-00-01-ovlat.mongodb.net:27017,cluster0-shard-00-02-ovlat.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true',
    {
    useMongoClient: true
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// CORS HEADERS***********
app.use((req,res,next)=> { // lässt alle drauf zugreifen
    res.header('Access-Controll-Allow_origin','*');
    res.header('Access-Controll-Allow-Header','*');

    if(req.method === 'OPTIONS'){
        res.header('Access-Controll-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.stat(200).json({});
    }
    next();
});

// Routes welche request behandeln soll
app.use('/products', productRoutes);
app.use('/order',orderRoutes);

//***** Error handling*****
app.use((req,res,next)=>{
    const error = new Error('Nicht gefunden');
    error.status = 404;
    next(error);
});

app.use((error,req,res,next)=>{
    res.status(error.status||500);
    res.json({
        error:{
            message: error.message
        }
    });
});


module.exports= app;
