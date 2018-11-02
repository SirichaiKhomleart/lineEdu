const messageFunction = require('./messageFunction.js');
const classroomAction = require('../DBaction/classroom')

announce = (req,res) => {
    console.log("req.body",req.body);
    req.body.selectedClass.map(async (data) => {
        let result = await classroomAction.getClassById(data);
        console.log("result",result);
        await result.classStudentList.map((subData) => {
            let msg = {
                "type": "flex",
                "altText": "Flex Message",
                "contents": {
                  "type": "bubble",
                  "header": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": "ANNOUNCEMENT",
                        "size": "sm",
                        "weight": "bold",
                        "color": "#7B06FF",
                        "wrap": true
                      },
                      {
                        "type": "text",
                        "text": result.className,
                        "size": "lg",
                        "wrap": true
                      }
                    ]
                  },
                  "body": {
                    "type": "box",
                    "layout": "horizontal",
                    "spacing": "md",
                    "contents": [
                      {
                        "type": "text",
                        "text": req.body.message,
                        "gravity": "center",
                        "wrap": true
                      }
                    ]
                  },
                  "footer": {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "separator"
                      },
                      {
                        "type": "text",
                        "text": "Announced by",
                        "margin": "md",
                        "size": "xxs",
                        "color": "#FF0665",
                        "wrap": true
                      },
                      {
                        "type": "text",
                        "text": "  " + req.body.sender,
                        "size": "xs",
                        "wrap": true
                      }
                    ]
                  }
                }
              }
            console.log("msg",msg);
            messageFunction.push(subData.userID,msg)
        })
    })
    res.send(200)
}

module.exports = {
    announce
};