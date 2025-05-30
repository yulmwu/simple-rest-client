import { readFileSync } from 'node:fs'
import Parser from './src/Parser'
import HttpRequestClient from './src/Client'
import elapsedTime from './src/utils/ElapsedTime'

const input = readFileSync('tests/sesori.test.http', 'utf-8')
const parsed = new Parser(input).parse()

const request = new HttpRequestClient<Record<string, string>>(parsed)

const [output, elapsed] = elapsedTime(() => request.send())
console.log(`Elapsed Time: ${elapsed.toFixed(2)} ms`)

output
    .then((res) => {
        console.log('Response Status:', res.status)
        console.log('Response Status Text:', res.statusText)

        if (Object.keys(res.headers).length > 0) {
            console.log('Response Headers:')
            for (const [key, value] of Object.entries(res.headers)) {
                console.log(`\t${key}: ${value}`)
            }
        } else {
            console.log('No response headers')
        }

        if (res.data) console.log('Response Data:', res.data)
    })
    .catch((error) => {
        console.error('Error:', error.message)
    })
