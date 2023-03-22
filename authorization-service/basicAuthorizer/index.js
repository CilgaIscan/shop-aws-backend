function toBase64(text) {
  const buff = Buffer.from(text);
  return buff.toString('base64');
}

function getCredsAsBase64() {
  const username = 'CilgaIscan';
  const password = process.env[username];
  const strToEncode = `${username}:${password}`;

  return toBase64(strToEncode);
}

function getAuthToken(headers) {
  if (headers.authorization) {
    return headers.authorization.replace('Basic ', '');
  } else {
    return;
  }
}

module.exports.handler = async (event) => {
  const authorizationToken = getAuthToken(event.headers);
  
  // auth header is not defined!
  if (!authorizationToken) {
    throw Error('Unauthorized');
  }
  
  const token = getCredsAsBase64();
  const isAuthorized = authorizationToken === token;

  return {
    isAuthorized,
  };
};
