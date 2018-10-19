listClass = () => {
    let responseObj = {
        "fulfillmentText": "your class is name LINE API with code: A2c35D",
        "fulfillmentMessages": [
            {
                "text": {
                    "text": ["ไม่ให้สร้างโว้ย"]
                }
            }
        ]
    }
    console.log("message: ",responseObj);
    return responseObj;
}

module.exports = {
    listClass
};