import lecture from './common';
import api from './endpoints';

export const getAdminLectures = (params) => {
  return new Promise((resolve, reject) => {
    lecture.getRequest(`${api.admin.getLectures}/${params}`)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const getAdminLecture = (params) => {
  return new Promise((resolve, reject) => {
    lecture.getRequest(`${api.admin.getLecture}/${params}`)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const getTutorInfo = () => {
  return new Promise((resolve, reject) => {
    lecture.getRequest(`${api.admin.getTutorInfo}/${process.env.VUE_APP_ENTERPRISE_ID}`)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const getStudentInfo = () => {
  return new Promise((resolve, reject) => {
    lecture.getRequest(`${api.admin.getStudentInfo}/${process.env.VUE_APP_ENTERPRISE_ID}`)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const listWorkbooks = () => {
  return new Promise((resolve, reject) => {
    lecture.getRequest(`${api.admin.listWorkbooks}/${process.env.VUE_APP_ENTERPRISE_ID}`)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}


export const adminCreateLecture = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.admin.CreateLecture}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}


export const adminUpdatelecture = (params) => {
  return new Promise((resolve, reject) => {
    lecture.putRequest(`${api.admin.Updatelecture}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const adminDeleteLecture = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.admin.DeleteLecture}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const updateStudent = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.admin.updateStudent}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const updateTutor = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.admin.updateTutor}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const tutorLogin = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.admin.tutorLogin}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}


export const studentLogin = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.admin.studentLogin}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const reassignMaterial = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.admin.reassignMaterial}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const deleteUploaded = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.admin.deleteUploaded}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const uploadImg = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.admin.uploadImg}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}

export const updateUploaded = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.admin.updateUploaded}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}


export const resendEmail = (params) => {
  return new Promise((resolve, reject) => {
    lecture.postRequest(`${api.admin.resendEmail}`, params)
      .then((result) => {
        resolve(result);
      }).catch((err) => {
        reject(err);
      })
  })
}
