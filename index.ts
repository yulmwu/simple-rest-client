import { readFileSync } from 'node:fs'
import Parser from './src/Parser'
import HttpRequestClient from './src/Client'

const input = readFileSync('test.http', 'utf-8')

const parser = new Parser(input)
const parsed = parser.parse()

const request = new HttpRequestClient(parsed)
request.send()
