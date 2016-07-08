'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

restService.post('/webhook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';
        var drinkItems = {"Tropical Crush": "10", "Mango Tango Crush": "8","Lemon Crush": "6","Lychee Crush": "9"}; 
        var specialItems = {"Chocolate Shake": "15", "Vanilla Shake": "6"};

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    if(requestBody.result.action == "getTotalCost")
                    {
                        var quantity = parseInt(requestBody.result.parameters.number);
                        var ice = requestBody.result.parameters.ice;
                        var ingredients =requestBody.result.parameters.ingredients;
                        var drinkname =requestBody.result.parameters.name;
                        var cost = 0;

                        if(drinkname in drinkItems){
                            cost = quantity * parseInt(drinkItems[drinkname]);
                        }
                        else {
                            cost = quantity * parseInt(specialItems[drinkname]);
                        }
                        
                        var msg = "So, your order is "+ quantity +" "+ drinkname +" with "+ ingredients + " ingredient and "+ ice + " ice. This would be a total of "+"$" +cost +" including taxes & 10% gratuity. Should i confirm?"
                        speech = msg;
                    }    
                    else if(requestBody.result.action == "getDrinksMenu")
                    {
                        speech = "1) Tropical Crush 2) Lychee Crush 3) Mango Tango Crush 4) Lemon Crush";
                    }          
                    else if(requestBody.result.action == "getSpecialMenu")
                    {
                        speech = "1) Chocolate Shake 2) Vanilla Shake";
                    }        
                }
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-calculation-sample'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});