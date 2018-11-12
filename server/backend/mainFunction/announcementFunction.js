const messageFunction = require('./messageFunction.js');
const classroomAction = require('../DBaction/classroom')

announce = (req,res) => {
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
            messageFunction.push(subData.userID,[msg])
        })
    })
    let announceClass = req.body.selectedClassName.join(", ");
    if (req.body.selectedClassName.length === 1) {
      announceClass = req.body.selectedClassName[0]
    }
    let reveiwMsg = [{
      type: "text",
      text: "Okay, message already sent to everyone in class(es)! Here is the preview."
    },{
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
              "text": announceClass,
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
    }]
    messageFunction.push(req.body.senderId,reveiwMsg)
    res.send(200)
}

uploadNewLec = async (req,res) => {
  let {classId,chapId,chapName,className,uploaderName} = req.body.metaData
  let {lecName,lecDesc,lecURL} = req.body.data;
  console.log(req.body.metaData,req.body.data);
  let result = await classroomAction.getClassById(classId);
  console.log("result",result);
  if (lecDesc === "") {
    lecDesc = "(No description)"
  }
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
                "text": "NEW LECTURE NOTE",
                "size": "sm",
                "weight": "bold",
                "color": "#17A085",
                "wrap": true
              },
              {
                "type": "text",
                "text": className,
                "size": "lg",
                "wrap": true
              },
              {
                "type": "text",
                "text": chapName,
                "size": "xxs",
                "weight": "bold",
                "color": "#17A085",
                "wrap": true
              }
            ]
          },
          "body": {
            "type": "box",
            "layout": "vertical",
            "spacing": "md",
            "contents": [
              {
                "type": "box",
                "layout": "horizontal",
                "contents": [
                  {
                    "type": "image",
                    "url": "https://lineedu.net/images/file.svg",
                    "flex": 1
                  },
                  {
                    "type": "separator",
                    "margin": "md"
                  },
                  {
                    "type": "box",
                    "layout": "vertical",
                    "flex": 4,
                    "margin": "md",
                    "contents": [
                      {
                        "type": "text",
                        "text": lecName,
                        "weight": "bold",
                        "wrap": true
                      },
                      {
                        "type": "text",
                        "text": lecDesc,
                        "size": "xxs",
                        "wrap": true
                      }
                    ]
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
                "type": "separator"
              },
              {
                "type": "text",
                "text": "Uploaded by",
                "margin": "md",
                "size": "xxs",
                "color": "#FF0665",
                "wrap": true
              },
              {
                "type": "text",
                "text": "  "+uploaderName,
                "size": "xs",
                "wrap": true
              },
              {
                "type": "button",
                "action": {
                  "type": "uri",
                  "label": "View File",
                  "uri": lecURL
                },
                "color": "#17A085",
                "margin": "md",
                "style": "primary",
                "gravity": "center"
              }
            ]
          }
        }
      }
      console.log("msg",JSON.stringify(msg));
      messageFunction.push(subData.userID,[msg])
  })
  res.send(200)
}

uploadConfirm = async (req,res) => {
  let {lecName,lecDesc,lecURL} = req.body
  if (lecDesc === "") {
    lecDesc = "(No description)"
  }
  let reveiwMsg = [{
    type: "text",
    text: "Okay, notifications already sent to everyone in class(es)!"
  },{
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
            "text": "NEW LECTURE NOTE",
            "size": "sm",
            "weight": "bold",
            "color": "#17A085",
            "wrap": true
          }
        ]
      },
      "body": {
        "type": "box",
        "layout": "vertical",
        "spacing": "md",
        "contents": [
          {
            "type": "box",
            "layout": "horizontal",
            "contents": [
              {
                "type": "image",
                "url": "https://lineedu.net/images/file.svg",
                "flex": 1
              },
              {
                "type": "separator",
                "margin": "md"
              },
              {
                "type": "box",
                "layout": "vertical",
                "flex": 4,
                "margin": "md",
                "contents": [
                  {
                    "type": "text",
                    "text": lecName,
                    "weight": "bold",
                    "wrap": true
                  },
                  {
                    "type": "text",
                    "text": lecDesc,
                    "size": "xxs",
                    "wrap": true
                  }
                ]
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
            "type": "separator"
          },
          {
            "type": "button",
            "action": {
              "type": "uri",
              "label": "View File",
              "uri": lecURL
            },
            "color": "#17A085",
            "margin": "md",
            "style": "primary",
            "gravity": "center"
          }
        ]
      }
    }
  }]
  console.log(JSON.stringify(reveiwMsg));
  messageFunction.push(req.body.senderId,reveiwMsg)
  res.send(200)
}

module.exports = {
    announce,uploadNewLec,uploadConfirm
};