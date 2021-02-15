import { Auth } from 'aws-amplify';
import store from '@/store/store';
import awsconfig from '@/utils/aws-exports';
import AWS from 'aws-sdk';
import axios from 'axios';
import {
  SET_ISLOGGEDIN_ACTION,
  SET_USER_ACTION,
  SET_JWTTOKEN_ACTION
} from '@/store/actionTypes';

export const checkLogin = async (to, from, next) => {
  if (!store.getters.isLoggedIn) {
    try {
      Auth.currentAuthenticatedUser()
        .then((user) => {
          store.dispatch(SET_USER_ACTION, user);
          store.dispatch(SET_ISLOGGEDIN_ACTION, true);
          // eslint-disable-next-line handle-callback-err
          user.getSession((err, result) => {
            if (result) {
              const jwtToken = result.getIdToken().getJwtToken();
              localStorage.setItem('jwtToken', jwtToken);
              store.dispatch(SET_JWTTOKEN_ACTION, jwtToken);
              AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId: awsconfig.aws_cognito_identity_pool_id,
                Logins: {
                  [process.env.VUE_APP_AWS_COGNITO_POOL_URL]: result
                    .getIdToken()
                    .getJwtToken()
                }
              });
            }
          });
          next();
        })
        .catch(() => {
          store.dispatch(SET_ISLOGGEDIN_ACTION, false)
          next({ name: 'login' });
        })
    } catch (err) {
      next({ name: 'login' });
    }
  } else {
    next();
  }
}

export const jwtStudentAuthentication = async (to, from, next) => {

  localStorage.clear();

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsconfig.aws_cognito_identity_pool_id
  });

  return new Promise((resolve, reject) => {
    AWS.config.credentials.get(async (err) => {
      if (err) {
        reject(err);
        next({ name: 'login' });
      } else {
        resolve(AWS.config.credentials);
        const studentId = to.params.url;
        if (!store.getters.isLoggedIn) {
          axios.get(`https://dev.api.smartclass.jp/student/token/${studentId}`, {
            'Accept' : 'application/json'
          }).then(response => {
            const jwtToken = response.data.jwtToken;
            if (!jwtToken) {
              reject(response.data)
              next({ path: 'login' });
            }
            store.dispatch(SET_JWTTOKEN_ACTION, jwtToken);
            next();
          })
        } else {
          next();
        }
      }
    });
  });
}

export const getCredentialsNoAuth = async (to, from, next) => {

  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsconfig.aws_cognito_identity_pool_id
  });

  return new Promise((resolve, reject) => {
    AWS.config.credentials.get((err) => {
      if (err) {
        reject(err);
        next({ name: 'login' });
      } else {
        resolve(AWS.config.credentials);
        next();
      }
    });
  });
}

export const jwtTutorAuthentication = async (to, from, next) => {
  localStorage.clear();
  AWS.config.credentials = new AWS.CognitoIdentityCredentials({
    IdentityPoolId: awsconfig.aws_cognito_identity_pool_id
  })
  return new Promise((resolve, reject) => {
    AWS.config.credentials.get(async (err) => {
      if (err) {
        reject(err);
        next({ name: 'login' });
      } else {
        resolve(AWS.config.credentials);
        const tutorId = to.params.url;
        if (!store.getters.isLoggedIn) {
          axios.get(`https://dev.api.smartclass.jp/tutor/token/${tutorId}`, {
            'Accept' : 'application/json'
          }).then(response => {
            const jwtToken = response.data.jwtToken;
            if (!jwtToken) {
              reject(response.data);
              next({ path: 'login' });
            }
            store.dispatch(SET_JWTTOKEN_ACTION, jwtToken);
            next();
          })
        } else {
          next();
        }
      }
    });
  });
}

