import lecture from './common';
import api from './endpoints';


export const getStudentLecture = (params) => {
  return new Promise((resolve, reject) => {
    lecture.getRequest(`${api.student.getLecture}/${params}`)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const uploadImg = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.student.uploadImg}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const updateUploaded = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.student.updateUploaded}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const deleteUploaded = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.student.deleteUploaded}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

