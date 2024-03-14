const { getSuperSecureToken } = require(Runtime.getFunctions()['helpers/token'].path)

const error = JSON.stringify({
    message: "Invalid or missing Flex Insights credentials",
    status: 403
})

//convert basic auth to credentials
const getCredentials = (authorization) => {
    let auth = authorization.split(" ")

    if (auth[0].toLowerCase() !== 'basic') {
        throw Error(error)
    }
    let bufferStr = Buffer.from(auth[1], "base64").toString('utf8')
    let raw_credentials = bufferStr.split(":")

    return {
        username: raw_credentials[0],
        password: raw_credentials[1]
    }
}

//validate auth by creating SST
exports.validator = async (authorization) => {
    if (!authorization) {
        throw Error(error)
    }

    const credentials = getCredentials(authorization)
    return await getSuperSecureToken(credentials)
}
