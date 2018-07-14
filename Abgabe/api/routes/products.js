const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');


// gibt aus wie  viele personen sich im studio befinden
router.get('/', (req,res,next) => {
    Product.find()
        .select('name price _id')
        .exec().then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc =>{
                return{
                    name: doc.anem,
                    price: doc.price,
                    _id: doc._id,
                    request:{
                        type: 'GET',
                        url:'http://localhost:3005/products/'+doc._id
                    }

                }
            })
        };
            res.status(200).json(response);


    })

        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        });
});


// ein nutzer betritt das studio
router.post('/',(req,res,next) => {
    const product = new Product ({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });

    product.save()
        .then(result => {
        console.log(result);
        res.status(201).json({
            message : 'Handling POST requests to /products',
            createdProduct: result
        });

    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    })
});

//Bekommen die Daten von einem benutzer im Studio mit der MitgliedNr und im welchen bereich er sich findet
router.get('/:productId',(req,res,next)=> {
    const id = req.params.productId;
    Product.findById(id)
        .exec()
        .then(doc => {
                console.log("From database", doc);

                if(doc) {
                    res.status(200).json(doc);
                }else{
                    res.status(404).json({message: 'keine gültige ID gefunden'});
                }
                }

        ).catch(err => {
        console.log(err);
        res.status(500).json({error: err});

    });

});

    router.patch('/:productId', (req, res, next) => {
        const id = req.params.productId;
        const updateOps = {};
        for (const ops of req.body){
            updateOps[ops.propName]= ops.value;
        }
        //ändert den bereich welcher der Nutzer betritt
        Product.update({_id: id },{$set: updateOps})
            .exec()
            .then(result => {
                console.log(result);
                res.stautus(200).json(result);
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error:err
                });
            });

    });

    // Nutzer verlässt das studio
    router.delete('/:productId', (req, res, next) => {
        const id = req.params.productId;
        Product.remove({_id: id }).exec().then(result => {
            res.status(200).json(result);
        })
            .catch(err => {
                console.log(err);
                res.status(500).json({
                    error: err
                });
            });
    });



module.exports = router;