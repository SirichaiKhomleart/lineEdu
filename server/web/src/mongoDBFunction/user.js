import axios from 'axios'

export async function addNewUser(data, callback) {
    await axios.post('/api/addUser',
        data, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function(response) {
        console.log(response);
        callback(response.data)
    });
}

export async function getUserByUserID(data) {
    let res = await axios.post('/api/getUserByUserID',
        data, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return res.data[0]
}