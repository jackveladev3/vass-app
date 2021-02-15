import axios from "axios";
import { getAPIClient } from "@/utils/api";
import Vue from 'vue';


class CommonService {

  apiClient = null;

  async apiClient() {
    return await getAPIClient();
  }

  async getRequest(url) {

    this.apiClient = await getAPIClient();

    return new Promise((resolve, reject) => {
      this.apiClient.invokeApi(null, url, 'Get')
      .then((result) => {
        resolve(result);
      }).catch((error) => {
        reject(error);
      });
    });

  }

  async postRequest(url, data) {

    this.apiClient = await getAPIClient();

    return new Promise((resolve, reject) => {
      this.apiClient.invokeApi(null, url, 'POST', {}, data)
        .then((result) => {
          resolve(result);
        }).catch((error) => {
          reject(error);
        })
    })
  }

  async putRequest(url, data) {

    this.apiClient = await getAPIClient();

    return new Promise((resolve, reject) => {
      this.apiClient.invokeApi(null, url, 'PUT', {}, data)
        .then((result) => {
          resolve(result);
        }).catch((error) => {
          reject(error);
        })
    })
  }

  async axiosPutRequest(url, data) {
    return axios.put(url, data)
    .then(() => {
      return true;
    });
  }

}

export default new CommonService();
