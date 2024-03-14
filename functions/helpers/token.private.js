// import custom request function
const { httpRequest } = require(Runtime.getFunctions()['helpers/request'].path)

// set base uri as global variable
const base_uri = `https://analytics.ytica.com/gdc/account`

// get SST
exports.getSuperSecureToken = async (credentials) => {
    // make custom request with login params
    let login_uri = `${base_uri}/login`
    let loginRequestData = {
        postUserLogin: {
            login: credentials.username,
            password: credentials.password,
            remember: 0,
            verify_level: 2
        }
    }
    const auth = await httpRequest("POST", login_uri, {}, loginRequestData)

    //return user profile and SST
    return {
        user: auth.data.userLogin.profile.split('/').pop(),
        sstoken: auth.data.userLogin.token,
    }
}

// get TT
exports.getTmpToken = async (sstoken) => {
    // make custom request
    let tt_uri = `${base_uri}/token`
    let req_auth = { sstoken }
    let token = await httpRequest("GET", tt_uri, req_auth)

    //return TT
    return token.data.userToken.token
}

// deactivate tokens
exports.logoutSST = async (auth, ttoken) => {
    // make custom request
    const logout_uri = `${base_uri}/login/${auth.user}`
    let req_auth = { sstoken: auth.sstoken, ttoken: ttoken }
    await httpRequest("DELETE", logout_uri, req_auth)
}
