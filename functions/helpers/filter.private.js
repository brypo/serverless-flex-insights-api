// import custom request function
const { httpRequest } = require(Runtime.getFunctions()['helpers/request'].path)

// get the Date filter
exports.getDateFilter = async (ttoken, workspace_id) => {
    // make custom request
    let date_url = `https://analytics.ytica.com/gdc/md/${workspace_id}/identifiers`
    let data = {
        identifierToUri: ["date.date.mmddyyyy"]
    }

    let auth = { ttoken }
    
    let date = await httpRequest("POST", date_url, auth, data)

    // return date filter uri
    return date.data.identifiers[0].uri
}
