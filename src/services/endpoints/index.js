module.exports = {
  admin: {
    login: '/admin/login',
    getLectures: '/admin/getLectures',
    getLecture: '/admin/getLecture',
    getTutorInfo: '/tutor/get',
    getStudentInfo: '/student/get',
    listWorkbooks: '/admin/listWorkbooks',
    CreateLecture: '/admin/createLecture',
    Updatelecture: '/admin/updateLecture',
    DeleteLecture: '/admin/deleteLecture',
    updateStudent: '/admin/updateStudent',
    updateTutor: '/admin/updateTutor',
    tutorLogin: '/tutor/login',
    studentLogin: '/student/login',
    reassignMaterial: '/admin/reassignMaterial',
    uploadImg: '/admin/uploads',
    updateUploaded: '/admin/updateUploaded',
    deleteUploaded: '/admin/deleteUploaded',
    resendEmail: '/admin/resendEmail'
  },
  student: {
    getLecture: '/student/getLecture',
    uploadImg: '/student/uploads',
    updateUploaded: '/student/updateUploaded',
    deleteUploaded: '/student/deleteUploaded',
    resendEmail: '/student/resendEmail'
  },
  tutor: {
    getLecture: '/tutor/getLecture',
    uploadImg: '/tutor/uploads',
    updateUploaded: '/tutor/updateUploaded',
    deleteUploaded: '/tutor/deleteUploaded',
    resendEmail: '/tutor/resendEmail'
  }
};
