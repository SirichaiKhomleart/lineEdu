const user = require('../DBaction/user')
const classroom = require('../DBaction/classroom')
const classCode = require('../DBaction/classCode')
const messageFunction = require('../mainFunction/messageFunction.js');

findClass = async (reply_token,parameter,intentName) => {
    let classCode = parameter.fields.classCode.stringValue;
    let result = await classroom.findByCode(classCode);
    console.log(classCode);
    console.log(result);
    sendClassDetail(reply_token,result.classroom,result.by,classCode)
}

sendClassDetail = async (reply_token,classroom,by,classCode) => {
    let owner = await user.findByUserID(classroom.classOwner);
    let coInstructorList = [{
        "type": "text",
        "text": "This class has no instructor assistance.",
        "size": "xs",
        "wrap": true
      }]
    let desc = ""
    let scoreList = classroom.classScore.map((data,key) => {
        let result = {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "text",
                "text": data.score+"pt",
                "flex": 1,
                "size": "xl",
                "align": "start",
                "gravity": "center",
                "weight": "bold",
                "color": "#7B06FF",
                "wrap": true
              },
              {
                "type": "separator"
              },
              {
                "type": "text",
                "text": data.sectionName,
                "flex": 3,
                "margin": "md",
                "gravity": "center",
                "wrap": true
              }
            ]
          }
        return result
    })
    if (classroom.classCoList.length !== 0) {
        coInstructorList = await Promise.all(classroom.classCoList.map(async (data) => {
            let result = await user.findByUserID(data)
            let content = {
                "type": "text",
                "text": result[0].userFullName,
                "size": "xs",
                "wrap": true
              }
            return content
        }))
    }
    if (classroom.classDesc !== "") {
        desc = classroom.classDesc
    }
     
    console.log(owner);
    console.log(scoreList);
    console.log(coInstructorList);


    let responseMsg = {
        "type": "flex",
        "altText": "Flex Message",
        "contents": {
          "type": "carousel",
          "contents": [
            {
              "type": "bubble",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "JOIN CLASS",
                    "size": "sm",
                    "weight": "bold",
                    "color": "#7B06FF",
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": classroom.className,
                    "size": "lg",
                    "gravity": "center",
                    "wrap": true
                  }
                ]
              },
              "hero": {
                "type": "image",
                "url": "https://lineedu.net/images/test.jpg",
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "md",
                "contents": [
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": owner[0].userFullName,
                        "size": "sm",
                        "wrap": true
                      },
                      {
                        "type": "separator",
                        "margin": "lg"
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": [
                      {
                        "type": "text",
                        "text": desc,
                        "size": "xxs",
                        "color": "#A7A7A7",
                        "wrap": true
                      }
                    ]
                  }
                ]
              },
              "footer": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "button",
                    "action": {
                        "type": "postback",
                        "label": "JOIN THIS CLASS",
                        "data": "joinClass:"+by+":"+classCode+":"+classroom._id
                    },
                    "color": "#7B06FF",
                    "style": "primary",
                    "gravity": "center"
                  }
                ]
              }
            },
            {
              "type": "bubble",
              "direction": "ltr",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "Class Details",
                    "size": "sm",
                    "weight": "bold",
                    "color": "#7B06FF"
                  },
                  {
                    "type": "text",
                    "text": "Scores Distribution",
                    "size": "lg"
                  },
                  {
                    "type": "separator",
                    "margin": "xl"
                  }
                ]
              },
              "hero": {
                "type": "image",
                "url": "https://raw.githubusercontent.com/eventbrite/britecharts/master/src/doc/images/thumbnails/donut-chart.png",
                "size": "full",
                "aspectRatio": "20:13",
                "aspectMode": "cover"
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "contents": scoreList
              }
            },
            {
              "type": "bubble",
              "header": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                  {
                    "type": "text",
                    "text": "Class Details",
                    "size": "sm",
                    "weight": "bold",
                    "color": "#7B06FF"
                  },
                  {
                    "type": "text",
                    "text": "Instructors",
                    "size": "lg",
                    "wrap": true
                  },
                  {
                    "type": "separator",
                    "margin": "xl"
                  }
                ]
              },
              "body": {
                "type": "box",
                "layout": "vertical",
                "spacing": "md",
                "contents": [
                  {
                    "type": "text",
                    "text": "Primary Instructor",
                    "weight": "bold",
                    "color": "#7B06FF",
                    "wrap": true
                  },
                  {
                    "type": "box",
                    "layout": "horizontal",
                    "contents": [
                      {
                        "type": "image",
                        "url": owner[0].userPicURL,
                        "flex": 1,
                        "align": "center",
                        "gravity": "center",
                        "aspectRatio": "1:1",
                        "aspectMode": "cover"
                      },
                      {
                        "type": "separator",
                        "margin": "md"
                      },
                      {
                        "type": "box",
                        "layout": "vertical",
                        "flex": 3,
                        "margin": "md",
                        "contents": [
                          {
                            "type": "text",
                            "text": owner[0].userFullName,
                            "flex": 3,
                            "align": "start",
                            "gravity": "bottom",
                            "weight": "bold",
                            "wrap": true
                          },
                          {
                            "type": "text",
                            "text": owner[0].userEmail,
                            "flex": 1,
                            "size": "xs",
                            "color": "#FF0665",
                            "wrap": true
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "separator"
                  },
                  {
                    "type": "text",
                    "text": "Instructor Assistants",
                    "weight": "bold",
                    "color": "#7B06FF",
                    "wrap": true
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "contents": coInstructorList
                  }
                ]
              }
            }
          ]
        }
    }
    messageFunction.replyTemplate(reply_token,responseMsg)
}

module.exports = {
    findClass
};