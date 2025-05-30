import { readFileSync, writeFileSync } from 'node:fs'
import Parser from './src/Parser'
import HttpRequestClient from './src/Client'

import elapsedTime from './src/utils/ElapsedTime'
import contentParser from './src/utils/ContentParser'
import { ContentType } from './src/types'
import templateReplacer from './src/utils/TemplateReplacer'
import HTMLOutput from './src/utils/HTMLOutput'

const input = readFileSync('sesori.test.http', 'utf-8')

const replaced = templateReplacer(input, {
    xxx: 'Hello, World!',
})

const parsed = new Parser(replaced).parse()

const request = new HttpRequestClient(parsed)

const [output, elapsed] = elapsedTime(() => request.send())
console.log(`Elapsed Time: ${elapsed.toFixed(2)} ms`)

output
    .then((res) => {
        console.log(`=> HTTP/1.1 ${res.status} ${res.statusText}`)

        const htmlOutputOptions: Record<string, object> = {}

        if (res.data) {
            const contentType = res.headers['Content-Type'] ?? 'text/plain'
            const contentTypeFirst = contentType.split(';')[0].trim()
            const body = contentParser(res.data, contentTypeFirst as ContentType)
            if (typeof body === 'object') {
                // TODO
                htmlOutputOptions['Body'] = body
            }
            // htmlOutputOptions['Body'] = body
        }

        if (Object.keys(res.headers).length > 0) {
            htmlOutputOptions['Headers'] = res.headers
        }

        console.log(htmlOutputOptions)

        const html = new HTMLOutput(htmlOutputOptions)
        writeFileSync('output.html', html.generate())
    })
    .catch((error) => {
        console.error('Error:', error.message)
    })
