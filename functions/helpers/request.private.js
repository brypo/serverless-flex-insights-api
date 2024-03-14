const axios = require("axios")

// axios request customized for Flex Insights
exports.httpRequest = async (method, path, auth, params) => {
    const options = {
        method: method,
        url: path,
        headers: {
            'Content-Type': 'application/json'
        }
    }

    if (params) {
        if (method.toUpperCase() === "GET") {
            options.params = params
        } else {
            options.data = params
        }
    }

    if (auth.sstoken) {
        options.headers['X-GDC-AuthSST'] = auth.sstoken
    }

    if (auth.ttoken) {
        options.headers['X-GDC-AuthTT'] = auth.ttoken
    }

    try {
        return await axios(options)
    }
    catch (error) {
        let formattedError = JSON.stringify({
            message: error.message,
            status: error.response?.status,
            data: error.response?.data
        })

        throw Error(formattedError)
    }
}
