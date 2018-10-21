import axios from 'axios'

export async function insertClassroom(data, callback) {
    await axios.post('/api/insertClassroom',
        data, {
        headers: {
            "Content-Type": "application/json"
        }
    }).then(function(response) {
        console.log(response);
        callback(response.data)
    });
}