
var io = require('socket.io-client');

var fs = require('fs');

//var config = require('../config.js');

//var JSONfn = require('json-fn'); //could not clone prototypes 
//var hydra = require('hydration'); // could not clone refrences
//var resurrectJs = require("resurrect-js"); //could not clone 
//var Cryo = require('cryo'); // could not clone object with reference
//var assert = require('assert');
//var bytewise = require('./');
//var encode = bytewise.encode;
var serialize = require('node-serialize');


var orderbookEngine = require("../orderbook-engine");
var OrderEvent = require('../orderbook-engine/lib/types').OrderEvent;

var ole = new orderbookEngine.OrderBook();

var List = require('collections/list');
var MultiMap = require('../orderbook-engine/lib/multimap');

let bids_ = new MultiMap(true); // reverse
let asks_ = new MultiMap();
let deferred_bid_crosses_ = new List();
let deferred_ask_crosses_ = new List();


const init = () => {
    // Setup socket listeners

  


    if (fs.existsSync("test-input-orders.json")) {
        try {
            var orders = JSON.parse(fs.readFileSync("test-input-orders.json"));

            console.log(orders);

            console.log('Order Matching starts');

            let orderToCanle;

            orders.forEach((order) => {

                if (order.id == "test1") {

                    //for (var i = 1; i <= 5; i++) {
                    //    order.id = "test15_" + i.toString();
                    //    if (order.id == "test15_4") {
                    //        orderToCanle = JSON.parse(JSON.stringify(order));
                    //    }
                    //    order.status = "created";
                    //    orderReceiver(order);
                    //}
                    orderToCanle = JSON.parse(JSON.stringify(order));
                    order.status = "created";
                    //order.id == "test15";
                    orderReceiver(order);

                }
                else {
                    order.status = "created";
                   // order.id == "test15"
                    orderReceiver(order);
                }
                //addOrder(order);

            });

            fs.writeFileSync('test-output-asks-orders.json', JSON.stringify(ole.asks_, null, "\t"));
            fs.writeFileSync('test-output-bids-orders.json', JSON.stringify(ole.bids_, null, "\t"));
            
            if (fs.existsSync("test-output-matched-orders.json")){
            fs.appendFileSync('test-output-matched-orders.json', "]");
            }
            
            console.log('starting canceling ');
			
            let cancelOrder = orders.filter((x) => { return x.id =="test15_10"})[0];
            orderToCanle.status="cancelling";
			 let startdate = new Date();
				console.log("start cancel  ",startdate );
                orderReceiver(orderToCanle);
			 let enddate = new Date();
				console.log("end cancel", enddate.getTime() - startdate.getTime());
        } catch (exp) {
            console.log("Error Occoured");
            console.log(exp);
        }
    }
    else {
        console.log('File test-input-orders.json file does not exist.');
    }

};

//if (socket.connected) {

// Listen to each match pair
var matchedPairArr = [];
var isEmpty=true;
ole.on(OrderEvent.fill, (filledTransaction) => {
    matchedPairArr.push(filledTransaction);
    fs.writeFileSync('test-output-matched-orders-final-state.json', JSON.stringify(matchedPairArr, null, "\t"));
   
    if(isEmpty)
    {
        fs.appendFileSync('test-output-matched-orders.json', "[\n");
        
    }
    else
    {
        fs.appendFileSync('test-output-matched-orders.json', ",\n");        
    }

    fs.appendFileSync('test-output-matched-orders.json', JSON.stringify(filledTransaction, null, "\t"));

    isEmpty=false;



});


const orderReceiver = (data) => {

    //data.price = parseFloat(data.price).toFixed(config.DECIMAL_PRECISION);

   

    if (data.status === "cancelling") {
        //
      
        let cancelOrder = new orderbookEngine.Order(data.side === "buy" ? true : false, data.price, data.size, undefined, undefined, data.id, undefined, undefined, data.userId, data.asset, data.currency, data.product_id, data.zebOrderId);

        ole.cancel(cancelOrder, function (err, result) {
			//console.log(result);
   //         console.log(err);
        });
    }

    if (data.status === "created") {
       
        let newOrder = new orderbookEngine.Order(data.side.toLowerCase() === "buy" ? true : false, data.price, data.size, undefined, undefined,
            data.id, undefined, undefined, data.userId, data.asset, data.currency, data.product_id, data.zebOrderId);
            ole.add(newOrder, {}, ordermatcherAndEmitter);
    };
}


const ordermatcherAndEmitter = (err, result) => {

    if (result.matched) {
        console.log("Order matched");
    }
    else {
        console.log("order added");
    }
}



init();