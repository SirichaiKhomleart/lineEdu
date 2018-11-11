import axios from 'axios'

export async function insertClassroom(data) {
    let response = await axios.post('/api/insertClassroom',
        data, {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return response.data
}

export async function getAllClassroom() {
    let response = await axios.get('/api/getAllClassroom',
        {
        headers: {
            "Content-Type": "application/json"
        }
    })
    return response.data
}

export async function getClassById(data) {
    let response = await axios.post('/api/getClassById',
        {classId: data},{
            headers: {
                "Content-Type": "application/json"
            }
        })
    return response.data
}

export async function getChapListByClassID(data) {
    let response = await axios.post('/api/getChapListByClassId',
        {classId: data},{
            headers: {
                "Content-Type": "application/json"
            }
        })
    return response.data
}

export async function insertChapter(classId, chapterName) {
    let response = await axios.post('/api/insertChapter',
        {classId: classId, chapterName: chapterName},{
            headers: {
                "Content-Type": "application/json"
            }
        })
    return response.data
}
