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
    let desc = "-"
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
                "color": "#FF0665",
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
    let label = "JOIN THIS CLASS"
    if (by === 'Private') {
      label = "BECOME INSTRUCTOR ASSISTANT"
    }
    let actionButton = {
      "type": "postback",
      "label": label,
      "data": "joinClass:"+by+":"+classCode+":"+classroom._id+":"+classroom.className
    }
    if (classroom.classMoreDetailList.length !== 0 && by === 'Public') {
      actionButton = {
        "type": "uri",
        "label": "JOIN THIS CLASS",
        "uri": "liff"
      }
    }
    if (classroom.classScore.length === 0) {
      scoreList = [{
        "type": "text",
        "text": "Score Distribution",
        "weight": "bold",
        "color": "#7B06FF"
      }]
    }
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
    console.log(scoreListSection);
    // console.log(coInstructorList);


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
                    "action": actionButton,
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
                    "text": "Instructor & Scores Distribution",
                    "size": "lg"
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
                "spacing": "lg",
                "contents": [
                  {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "md",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Primary Instructor",
                        "weight": "bold",
                        "color": "#7B06FF"
                      },
                      {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                          {
                            "type": "image",
                            "url": "https://timedotcom.files.wordpress.com/2014/05/rtr3pxzh.jpg",
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
                                "text": "Assc. Prof. Prayut Chan-o-cha",
                                "flex": 3,
                                "align": "start",
                                "gravity": "bottom",
                                "weight": "bold",
                                "wrap": true
                              },
                              {
                                "type": "text",
                                "text": "emailll",
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
                        "color": "#7B06FF"
                      },
                      {
                        "type": "box",
                        "layout": "vertical",
                        "contents": [
                          {
                            "type": "text",
                            "text": "This class has no instructor assistance.",
                            "size": "xs"
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "spacing": "xs",
                    "contents": [
                      {
                        "type": "text",
                        "text": "Score Distribution",
                        "weight": "bold",
                        "color": "#7B06FF"
                      },
                      ...scoreList
                    ]
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