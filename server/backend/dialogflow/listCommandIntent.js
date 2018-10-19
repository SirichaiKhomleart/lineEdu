listCommand = () => {
    let responseObj = {
        "type": 4,
        "payload": {
            "line": {
                "type": "template",                                                                                                                                                                                                                           "altText": "This is a buttons template",
                "template": {
                    "type": "buttons",
                    "thumbnailImageUrl": "https://images.justlanded.com/event_images/Tets/photo/events_original_45195_42919.jpg",
                    "imageAspectRatio": "rectangle",
                    "imageSize": "cover",
                    "imageBackgroundColor": "#FFFFFF",
                    "title": "Menu",
                    "text": "Please select",
                    "defaultAction": {
                        "type": "uri",
                        "label": "View detail",
                        "uri": "http://example.com/page/123"
                    },
                    "actions": [
                        {
                            "type": "postback",
                            "label": "Buy",
                            "data": "action=buy&itemid=123"
                        },
                        {
                            "type": "postback",
                            "label": "Add to cart",
                            "data": "action=add&itemid=123"
                        },
                        {
                            "type": "uri",
                            "label": "View detail",
                            "uri": "http://example.com/page/123"
                        }
                    ]
                }
            }
        }
    }
    console.log("message: ",responseObj);
    return responseObj;
}

module.exports = {
    listCommand
};