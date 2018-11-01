createClass = () => {
    let responseObj = {
        "fulfillmentText": "return classroom code: A2c35D",
        "fulfillmentMessages": [
            {
                "text": {
                    "text": ["ไม่ให้สร้างโว้ย"]
                }
            }
        ]
    }
    console.log(responseObj);
    return responseObj;
}

module.exports = {
    createClass
};