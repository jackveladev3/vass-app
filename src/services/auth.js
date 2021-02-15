import store from '@/store/store';
import api from '@/services/endpoints/index';
import { Auth } from 'aws-amplify'
import { getAPIClient } from "@/utils/api";
import awsconfig from '@/utils/aws-exports';
import AWS from 'aws-sdk';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import Router from '@/router/index';
import {
  SET_ISLOGGEDIN_ACTION
} from '@/store/actionTypes';

class AuthService {

  apiClient = null;

  async apiClient() {
    return await getAPIClient();
  }

  async login (email, password) {
    return new Promise((resolve, reject) => {
      Auth.signIn(email, password)
        .then((result) => {
          resolve(result);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  async confirmLogin ( header, params) {

    this.apiClient = await getAPIClient();

    return this.apiClient.invokeApi( null, api.admin.login, 'POST', header, params )
      .then((result) => {
        return result;
      })
  }

  logout() {

    store.dispatch(SET_ISLOGGEDIN_ACTION, false);

    const userPool = new CognitoUserPool({
      UserPoolId: awsconfig.aws_user_pools_id,
      ClientId: awsconfig.aws_user_pools_web_client_id
    });

    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      if (AWS.config.credentials && AWS.config.credentials.clearCachedId) {
        AWS.config.credentials.clearCachedId();
      }
      cognitoUser.signOut();
    }
    localStorage.clear();

    if(Router.currentRoute.name !== 'login')
    Router.push({ path: `/login` });

  }

}

export default new AuthService();
