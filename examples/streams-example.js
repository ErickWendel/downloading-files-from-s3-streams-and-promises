const { createWriteStream } = require('fs')
const { Transform, pipeline } = require('stream')
const { promisify } = require('util')
const pipelineAsync = promisify(pipeline)

const csvTojson = require('csvtojson')
const jsonTocsv = require('json-to-csv-stream')

const AWS = require('aws-sdk')
const S3 = new AWS.S3()

const filePathOnBucket = {
    Bucket: 'survey-erick-001',
    Key: 'survey_results_public.csv'
}
const fileOutput = createWriteStream('output-stream.csv')
const ONE_SECOND = 1000

setInterval(() => { process.stdout.write('.') }, ONE_SECOND).unref()

const mapStream = new Transform({
    transform: (chunk, encoding, cb) => {
        const line = JSON.parse(chunk)
        // console.log('line.Respondent', line.Respondent)
        return cb(null, JSON.stringify({
            Respondent: line.Respondent,
            Country: line.Country,
            YearsCoding: line.YearsCoding,
        }))
    }
})

    ;
(async () => {
    console.time('elapsed')
    console.log('downloading file...')
    const dataStream = await S3
        .getObject(filePathOnBucket)
        .createReadStream()

    await pipelineAsync(
        dataStream,
        csvTojson(),
        mapStream,
        jsonTocsv(),
        fileOutput
    )
    console.log()
    console.timeEnd('elapsed')
})()