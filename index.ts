import { readFileSync } from 'node:fs'
import Parser from './src/Parser'
import HttpRequest from './src/Client'

const input = readFileSync('test.http', 'utf-8')

const parser = new Parser(input)
const parsed = parser.parse()

const request = new HttpRequest(parsed)
request.send()
