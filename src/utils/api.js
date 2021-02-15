import awsconfig from '@/utils/aws-exports'
import apigClientFactory from 'aws-api-gateway-client'

async function getAwsConfig () {

  return new Promise(function (resolve, reject) {
    window.AWS.config.getCredentials(async function (err) {
      if (err) {
        // console.log('Error getting credentials', err)
        return reject(err)
      } else {
        resolve({
          accessKey: window.AWS.config.credentials.accessKeyId,
          secretKey: window.AWS.config.credentials.secretAccessKey,
          sessionToken: window.AWS.config.credentials.sessionToken,
          region: awsconfig.aws_project_region,
          invokeUrl: process.env.VUE_APP_INVOKE_URL
        })
      }
    })
  })
}

export async function getAPIClient () {

  const config = await getAwsConfig();

  return apigClientFactory.newClient(config)
}
