import axios from 'axios'

export async function announceMsg(data) {
    let response = await axios.post('/api/annoucement',
            data,{
            headers: {
                "Content-Type": "application/json"
            }
        })
    return response.data
}