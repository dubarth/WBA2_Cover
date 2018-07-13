const express = require('express');
const router = express.Router();

//Verwende einkommenden GET requests zu /order
router.get('/', (req,res,next)=> {
    res.status(200).json({
        message:'Auftrag wurde gegeben'
    });
});


router.post('/', (req,res,next)=> {
    const order = {
        productId: req.body.productId,
        quantity: req.body.quantity

    }
    res.status(201).json({
        message:'Auftrag wurde erstellt',
        order: order
    });
});

router.get('/:orderId', (req,res,next)=> {
    res.status(200).json({
        message:'Auftrag details',
        orderId: req.params.orderId
    });
});

router.delete('/:orderId', (req,res,next)=> {
    res.status(200).json({
        message:'Auftrag gelöscht',
        orderId: req.params.orderId
    });
});

module.exports = router;