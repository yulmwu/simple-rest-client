import { readFileSync } from 'node:fs'
import Parser from './src/Parser'
import HttpRequestClient from './src/Client'

import elapsedTime from './src/utils/ElapsedTime'
import contentParser from './src/utils/ContentParser'
import { ContentType } from './src/types'

const input = readFileSync('tests/sesori.test.http', 'utf-8')
const parsed = new Parser(input).parse()

const request = new HttpRequestClient(parsed)

const [output, elapsed] = elapsedTime(() => request.send())
console.log(`Elapsed Time: ${elapsed.toFixed(2)} ms`)

output
    .then((res) => {
        console.log(`=> HTTP/1.1 ${res.status} ${res.statusText}`)

        if (Object.keys(res.headers).length > 0) {
            console.log('Response Headers:')
            console.table(res.headers)
        } else {
            console.log('No response headers')
        }

        if (res.data) {
            const contentType = res.headers['Content-Type'] ?? 'text/plain'
            const contentTypeFirst = contentType.split(';')[0].trim()
            console.log(`Response Body (${contentTypeFirst}):`)
            console.table(contentParser(res.data, contentTypeFirst as ContentType))
        }
    })
    .catch((error) => {
        console.error('Error:', error.message)
    })
