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
                "name": "Strawberry Basil Soda",
                "price": "10",
                "isSpecial": false
            },
            {
                 "name": "Cucumber Gimlet",
                "price": "8",
                "isSpecial": false
            },
            {
                 "name": "The Bright & Bitter",
                "price": "6",
                "isSpecial": false
            },
            {
                 "name": "Blueberry Hard Lemonade",
                "price": "9",
                "isSpecial": false
            },
            ,
            {
                 "name": "Bubbly Lemonade",
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
                    if(requestBody.result.action == "getTotalCost" || requestBody.result.action == "reorderTotalCost")
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
                        
                        
                        if(requestBody.result.action == "getTotalCost")
                        {
                            speech = "So, your order is "+ quantity +" "+ drinkname +" with "+ ingredients + " ingredient and "+ ice + " ice. This would be a total of "+"$" +cost +" including taxes & 10% gratuity. Should i confirm?";
                            slack_message = {
                                "text": "So, your order is "+ quantity +" "+ drinkname +" with "+ ingredients + " ingredient and "+ ice + " ice. \nThis would be a total of "+"$" +cost +" including taxes & 10% gratuity. Should i confirm?"
                            }
                        }
                        else if(requestBody.result.action == "reorderTotalCost")
                        {
                            speech = "Your last order was "+ quantity +" "+ drinkname +" with "+ ingredients + " ingredient and "+ ice + " ice. This would be a total of "+"$" +cost +" including taxes & 10% gratuity. Should i confirm?";                            
                            slack_message = {
                                "text": "Your last order was "+ quantity +" "+ drinkname +" with "+ ingredients + " ingredient and "+ ice + " ice. \nThis would be a total of "+"$" +cost +" including taxes & 10% gratuity. Should i confirm?"
                            }
                        }
                        
                    }    
                    else if(requestBody.result.action == "getDrinksMenu")
                    {
                        speech = "Main menu: * Strawberry Basil Soda * Cucumber Gimlet * The Bright & Bitter * Blueberry Hard Lemonade Today's special menu: * Bubbly Lemonade * Mojito";
                        slack_message = {
                            "text": "Main menu: \n* Strawberry Basil Soda \n* Cucumber Gimlet \n* The Bright & Bitter \n* Blueberry Hard Lemonade \nToday's special menu: \n* Bubbly Lemonade \n* Mojito"
                        }                        
                    }   
                    else if(requestBody.result.action == "getSpecialMenu")
                    {
                        speech = "Today's special menu: * Bubbly Lemonade * Mojito";
                        slack_message = {
                            "text": "Today's special menu: \n* Bubbly Lemonade \n* Mojito"
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