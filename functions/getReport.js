//import methods from helper functions 
const { validator } = require(Runtime.getFunctions()['helpers/validator'].path)
const { getTmpToken, logoutSST } = require(Runtime.getFunctions()['helpers/token'].path)
const { getReportExport, getCsvData } = require(Runtime.getFunctions()['helpers/report'].path)

exports.handler = async (context, event, callback) => {
    //set up response
    const response = new Twilio.Response()
    response.appendHeader('Access-Control-Allow-Origin', '*')
    response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS, POST, GET')
    response.appendHeader('Access-Control-Allow-Headers', 'Content-Type')

    //get request variables
    const { WorkspaceId, ReportId, DateStart, DateEnd } = event

    console.log(ReportId)
    
    try {
        //validate credentials - return object with user profile_id and SST
        const auth = await validator(event.request.headers.authorization)

        //get temporary token
        const ttoken = await getTmpToken(auth.sstoken)

        //get report export
        const reportExport = await getReportExport(ttoken, WorkspaceId, ReportId, { startDate: DateStart, endDate: DateEnd })

        //get report csv
        const reportCsv = await getCsvData(ttoken, reportExport, ReportId)

        //deactivate the sstoken
        await logoutSST(auth, ttoken)

        let size = Buffer.byteLength(reportCsv, 'utf8')
        console.log(size)

        //if functions response payload limit (4MB) is reached
        if (size < (4 * 1024 * 1024)) {
            //return CSV in response
            response.appendHeader('Content-Type', 'text/csv')
            response.setBody(reportCsv)
        } else {
            const downloadLink = { downloadCsvLink: `https://analytics.ytica.com${reportExport}` }
            //return link to CSV in response
            response.appendHeader('Content-Type', 'application/json')
            response.setBody(downloadLink)
        }
    }
    catch (e) {
        let error = JSON.parse(e.message)
        response.setBody(error)
        response.setStatusCode(error.status)
        response.appendHeader('Content-Type', 'application/json')
    }

    return callback(null, response)
}