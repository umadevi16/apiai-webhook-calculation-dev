'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

restService.post('/webhook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';
        var data = {};
        var drinkPrice = {"Tropical Crust": "10", "Mango Tango Crust": "8","Lemon Crust": "6.2","Lychee Crust": "9"}; 

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
                        var num = parseInt(requestBody.result.parameters.number);
                        var ice = requestBody.result.parameters.ice;
                        var ingredients =requestBody.result.parameters.ingredients;
                        var drinkname =requestBody.result.parameters.name;
                        var cost = 0;

                        if (drinkname in drinkPrice)
                        {
                            cost = num * parseInt(drinkname[drinkname]);
                        }
                        
                        var msg = "So, your order is "+ num +" "+ drinkname +" with "+ ingredients + " ingredient and "+ ice + " ice. This would be a total of "+"$" +cost +" including taxes & 10% gratuity. Should i confirm?"
                        speech = msg;
                    }    
                    else if(requestBody.result.action == "getDrinksMenu")
                    {
                        speech = "Tropical Crush \nMango Tango Crush \nLemon Crush \nLychee Crush";
                        var slack_message = {
                            "text": "Tropical Crush \nMango Tango Crush \nLemon Crush \nLychee Crush"
                        }
                        data = {"slack": slack_message};
                    }                
                }
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            data: data,
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