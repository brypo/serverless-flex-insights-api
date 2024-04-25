const { getDateFilter } = require(Runtime.getFunctions()['helpers/filter'].path)
const { httpRequest } = require(Runtime.getFunctions()['helpers/request'].path)


// get the parameters for report export
const getReportExportConfig = async (ttoken, workspace_id, report_id, dateFilter) => {
    return JSON.stringify({
        report_req: {
            report: `/gdc/md/${workspace_id}/obj/${report_id}`,
            context: {
                filters: [
                    {
                        uri: await getDateFilter(ttoken, workspace_id),
                        constraint: {
                            type: "interval",
                            from: dateFilter.startDate,
                            to: dateFilter.endDate
                        }
                    }
                ]
            }
        }
    })
}

// get the report export
const getReportExport = async (ttoken, workspace_id, report_id, dateFilter) => {
    let export_uri = `https://analytics.ytica.com/gdc/app/projects/${workspace_id}/execute/raw`
    let params = await getReportExportConfig(ttoken, workspace_id, report_id, dateFilter)
    let auth = { ttoken }

    let reportExport = await httpRequest("POST", export_uri, auth, params)

    // return the report export uri
    return reportExport.data.uri
}

// get csv data from export
const getCsvData = async (ttoken, reportExport, report_id) => {
    let csv_uri = `https://analytics.ytica.com${reportExport}`

    let auth = { ttoken }

    const reportCsvObj = await httpRequest("GET", csv_uri, auth)

    switch (reportCsvObj.status) {
        case 200:
            if (typeof reportCsvObj.data === "string") { //csv has data
                return reportCsvObj.data
            }
            else {
                throw Error(JSON.stringify({ message: "Unexpected data returned from Flex Insights API", status: 400 }))
            }
        case 202:
            return await getCsvData(ttoken, reportExport, report_id)
        default:
            throw Error(JSON.stringify({ message: "Something went wrong getting report CSV data.", status: reportCsvObj.status }))
    }
}

module.exports = {
    getReportExport,
    getCsvData
}
