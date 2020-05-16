// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ybciggjze7'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'aaltheiab.auth0.com',            // Auth0 domain
  clientId: 'Y3lFFFng2dHvBIdWdD0k3c4b6lhg2fNC',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback/'
}
