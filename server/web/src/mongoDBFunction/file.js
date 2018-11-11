import axios from 'axios'

export async function uploadDocumentRequest(data, path) {
  const formData = new FormData();
  formData.append('files',data);
  let response = await axios.post('/api/upload', formData, { headers: { path: path}})
  return response.data
}

export async function insertUploadHis(data, metaData, senderId) {
  let response = await axios.post('/api/insertUploadHis',
        {data: data, metaData: metaData, senderId: senderId},{
            headers: {
                "Content-Type": "application/json"
            }
        })
    return response.data
}

export async function uploadConfirm(data) {
    let response = await axios.post('/api/uploadConfirm',
        data,{
              headers: {
                  "Content-Type": "application/json"
              }
          })
      return response.data
  }
