import lecture from './common';
import api from './endpoints';


export const getTutorLecture = (params) => {
  return new Promise((resolve, reject) => {
    lecture.getRequest(`${api.tutor.getLecture}/${params}`)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const deleteUploaded = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.tutor.deleteUploaded}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const uploadImg = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.tutor.uploadImg}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const updateUploaded = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.tutor.updateUploaded}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}


export const resendEmail = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.tutor.resendEmail}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}
