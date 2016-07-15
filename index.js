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
        var slack_message = {};

        var menu = [
            {
                "name": "Tropical Crush",
                "price": "10",
                "isSpecial": false
            },
            {
                 "name": "Mango Tango Crush",
                "price": "8",
                "isSpecial": false
            },
            {
                 "name": "Lemon Crush",
                "price": "6",
                "isSpecial": false
            },
            {
                 "name": "Lychee Crush",
                "price": "9",
                "isSpecial": false
            },
            ,
            {
                 "name": "Blueberry Crush",
                "price": "15",
                "isSpecial": true
            },
            ,
            {
                 "name": "Mojito",
                "price": "12",
                "isSpecial": true
            }
        ];

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

                        menu.forEach(function(drinks) {
                            if(drinkname == drinks.name){
                            cost = quantity * parseInt(drinks.price);
                        }
                        }, this);
                        
                        
                        var msg = "So, your order is "+ quantity +" "+ drinkname +" with "+ ingredients + " ingredient and "+ ice + " ice. This would be a total of "+"$" +cost +" including taxes & 10% gratuity. Should i confirm?";
                        speech = msg;
                        slack_message = {
                            "text": "So, your order is "+ quantity +" "+ drinkname +" with "+ ingredients + " ingredient and "+ ice + " ice. \nThis would be a total of "+"$" +cost +" including taxes & 10% gratuity. Should i confirm?"
                        }
                    }    
                    else if(requestBody.result.action == "getDrinksMenu")
                    {
                        speech = "Main menu: * Tropical Crush * Lychee Crush * Mango Tango Crush * Lemon Crush Today's special menu: * Blueberry Crush * Mojito";
                        slack_message = {
                            "text": "Main menu: \n* Tropical Crush \n* Mango Tango Crush \n* Lemon Crush \n* Lychee Crush \nToday's special menu: \n* Blueberry Crush \n* Mojito"
                        }                        
                    }   
                    else if(requestBody.result.action == "getSpecialMenu")
                    {
                        speech = "Today's special menu: * Blueberry Crush * Mojito";
                        slack_message = {
                            "text": "Today's special menu: \n* Blueberry Crush \n* Mojito"
                        }  
                    }                  
                    data = {"slack": slack_message};
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