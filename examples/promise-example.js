const { promises: { writeFile } } = require('fs')

const AWS = require('aws-sdk')
const S3 = new AWS.S3()

const filePathOnBucket = {
    Bucket: 'survey-erick-001',
    Key: 'survey_results_public.csv'
}
const ONE_SECOND = 1000
setInterval(() => { process.stdout.write('.') }, ONE_SECOND).unref()

;
(async () => {
    console.time('elapsed')
    console.log('downloading file...', new Date().toISOString())
    const { Body } = await S3.getObject(filePathOnBucket).promise()
    await writeFile('output.json', Body.toString())
    console.log()
    console.timeEnd('elapsed')
})()