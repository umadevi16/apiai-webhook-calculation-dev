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
                "image_url": "http://atmedia.imgix.net/51908962be2e4dbae14b488de63831c7e57a86a9",
                "isSpecial": false
            },
            {
                 "name": "Cucumber Gimlet",
                "price": "8",
                "image_url": "http://assets.epicurious.com/photos/560dd770f3a00aeb2f1d27b2/master/pass/235327.jpg",
                "isSpecial": false
            },
            {
                 "name": "The Bright & Bitter",
                "price": "6",
                "image_url": "https://716f24d81edeb11608aa-99aa5ccfecf745e7cf976b37d172ce54.ssl.cf1.rackcdn.com/the-bright--bitter-1280924l1.jpg",
                "isSpecial": false
            },
            {
                 "name": "Blueberry Hard Lemonade",
                "price": "9",
                "image_url": "http://4.bp.blogspot.com/-JcwBEm9JNlU/T_ZMDfE6FGI/AAAAAAAABA8/N5IFoJCqWXc/s1600/blueberrylemonade4.jpg",
                "isSpecial": false
            },
            ,
            {
                 "name": "Bubbly Lemonade",
                "price": "15",
                "image_url": "http://www.bakespace.com/images/large/d4523ab8582819b31e6f2e7e0147b2ab.jpeg",
                "isSpecial": true
            },
            ,
            {
                 "name": "Mojito",
                "price": "12",
                "image_url": "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTdVYlA2iLCpBGiucUN6KYQGuJWPH8EcDZShNx1-LqZIcs9ZqgONg",
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
                        var image_url = "";

                        menu.forEach(function(drinks) {
                            if(drinkname == drinks.name){
                            cost = quantity * parseInt(drinks.price);
                            image_url = drinks.image_url;
                        }
                        }, this);
                        
                        var grandTotal = cost + (.1 * cost);
                        
                        if(requestBody.result.action == "getTotalCost")
                        {
                            speech = "So, your order is "+ quantity +" "+ drinkname +" with "+ ingredients + " ingredient and "+ ice + " ice. This would be a total of "+"$" + grandTotal +" including taxes & 10% gratuity. Should I confirm?";
                            //slack_message = {
                            //    "text": "So, your order is "+ quantity +" "+ drinkname +" with "+ ingredients + " ingredient and "+ ice + " ice. \nThis would be a total of "+"$" +cost +" including taxes & 10% gratuity. Should I confirm?"
                            //}
                            slack_message = {
                            "text": "You have ordered: ",
                            "attachments": [
                                {
                                    "text": drinkname + "with " + ingredients + " and " + ice + " ice" + "\nQuantity: " + quantity + "\nCost: $" + cost,
                                    "thumb_url": image_url
                                },
                                {
                                    "fallback": "Your total order cost is $" + grandTotal + " (including taxes & 10% gratuity). Should I confirm?",
                                    "title": "Your total order cost is $" + grandTotal + " (including taxes & 10% gratuity). Should I confirm?",
                                    "callback_id": "comic_1234_xyz",
                                    "color": "#3AA3E3",
                                    "attachment_type": "default",
                                }
                            ]
                        }
                        }
                        else if(requestBody.result.action == "reorderTotalCost")
                        {
                            speech = "Your last order was "+ quantity +" "+ drinkname +" with "+ ingredients + " ingredient and "+ ice + " ice. This would be a total of "+"$" + grandTotal +" including taxes & 10% gratuity. Should I repeat same?";                            
                            //slack_message = {
                            //    "text": "Your last order was "+ quantity +" "+ drinkname +" with "+ ingredients + " ingredient and "+ ice + " ice. \nThis would be a total of "+"$" +cost +" including taxes & 10% gratuity. Should I repeat same?"
                            //}
                            slack_message = {
                            "text": "Your last order was: ",
                            "attachments": [
                                {
                                    "text": drinkname + "with " + ingredients + " and " + ice + " ice" + "\nQuantity: " + quantity + "\nCost: $" + cost,
                                    "thumb_url": image_url
                                },
                                {
                                    "fallback": "Your total order cost is $" + grandTotal + " (including taxes & 10% gratuity). Should I repeat same?",
                                    "title": "Your total order cost is $" + grandTotal + " (including taxes & 10% gratuity). Should I repeat same?",
                                    "callback_id": "comic_1234_xyz",
                                    "color": "#3AA3E3",
                                    "attachment_type": "default",
                                }
                            ]
                        }
                        }
                        
                    }    
                    else if(requestBody.result.action == "getTotalCostMultiple")
                    {
                        var quantity1 = parseInt(requestBody.result.parameters.number1);
                        var ice1 = requestBody.result.parameters.ice1;
                        var ingredients1 =requestBody.result.parameters.ingredients1;
                        var drinkname1 =requestBody.result.parameters.name1;
                        var quantity2 = parseInt(requestBody.result.parameters.number2);
                        var ice2 = requestBody.result.parameters.ice2;
                        var ingredients2 =requestBody.result.parameters.ingredients2;
                        var drinkname2 =requestBody.result.parameters.name2;
                        var cost1 = 0;
                        var cost2 = 0;
                        var image_url1 = "";
                        var image_url2 = "";

                        menu.forEach(function(drinks) {
                            if(drinkname1 == drinks.name) {
                            cost1 += quantity1 * parseInt(drinks.price);
                            image_url1 = drinks.image_url;
                        }
                        else if(drinkname2 == drinks.name) {
                             cost2 += quantity2 * parseInt(drinks.price);
                             image_url2 = drinks.image_url;
                        }
                        }, this);

                        var totalCost = cost1 + cost2;
                        var grandTotal = totalCost + (.1 * totalCost);
                        
                        speech = "So, your order is "+ quantity1 +" "+ drinkname1 +" with "+ ingredients1 + " ingredient and "+ ice1 + " ice and "+ quantity2 +" "+ drinkname2 +" with "+ ingredients2 + " ingredient and "+ ice2 + " ice. This would be a total of "+"$" + grandTotal +" including taxes & 10% gratuity. Should I confirm?";
                        slack_message = {
                            "text": "You have ordered: ",
                            "attachments": [
                                {
                                    "text": drinkname1 + "with " + ingredients1 + " and " + ice1 + " ice" + "\nQuantity: " + quantity1 + "\nCost: $" + cost1,
                                    "thumb_url": image_url1
                                },
                                {
                                    "text": drinkname2 + "with " + ingredients2 + " and " + ice2 + " ice" + "\nQuantity: " + quantity2 + "\nCost: $" + cost2,
                                    "thumb_url": image_url2
                                },
                                {
                                    "fallback": "Your total order cost is $" + grandTotal + " (including taxes & 10% gratuity). Should I confirm?",
                                    "title": "Your total order cost is $" + grandTotal + " (including taxes & 10% gratuity). Should I confirm?",
                                    "callback_id": "comic_1234_xyz",
                                    "color": "#3AA3E3",
                                    "attachment_type": "default",
                                }
                            ]
                        }
                    }
                    else if(requestBody.result.action == "help")
                    {
                        speech = "Hi, here are some example tasks that you can ask me to do: **See menu by saying: *I want to see menu *What is special today? *I want to order a drink **Or simply order a drink from menu by saying: *I want 2 mojito. *Get me 1 strawberry basil soda. **Confirm or update your drink order: *I wanna update my order. *I want to change drink to blueberry hard lemonade. *update ingredients *update ice quantity **Repeat order";
                        slack_message = {
                            "text": "Hi, here are some example tasks that you can ask me to do:\n\nSee menu by saying:\nI want to see menu\nWhat is special today?\nI want to order a drink\n\nOr simply order a drink from menu by saying:\nI want 2 mojito.\nGet me 1 strawberry basil soda.\n\nConfirm or update your drink order:\nI wanna update my order.\nI want to change drink to blueberry hard lemonade.\nupdate ingredients\nupdate ice quantity\n\nRepeat order"
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