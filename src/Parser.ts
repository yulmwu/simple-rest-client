import { RestClientException } from './Error'
import { ParsedHttpStructure, ParsedRequest } from './types'

/*
GET /api/v1/users HTTP/1.1       ---> Request(Start) line
Host : example.com             --|--> Headers
Content-Type: application/json --|
                                 ---> Blank line (indicates end of headers)
{"name": "John Doe"}             ---> Body(Payload)

*/

class Parser {
    private raw: string

    constructor(raw: string) {
        this.raw = raw.trim()
    }

    private splitArea(raw: string): ParsedHttpStructure {
        const lines = this.raw.split(/\r?\n/)

        const requestLine = lines.shift() ?? ''
        const [method, path, _] = requestLine.split(' ')

        if (!method || !path) throw new RestClientException('Invalid request format')

        return {
            method,
            path,
            lines,
        }
    }

    public parse(): ParsedRequest {
        const { method, path, lines } = this.splitArea(this.raw)

        const headers: Record<string, string> = {}
        const bodyLines: Array<string> = []
        let isBody = false

        for (const line of lines) {
            if (line.trim() === '' && !isBody) {
                isBody = true
                continue
            }

            if (!isBody) {
                const [key, ...rest] = line.split(':')
                headers[key.trim()] = rest.join(':').trim()
            } else bodyLines.push(line)
        }

        const body = bodyLines.join('\n')
        return { method, path, headers, body }
    }
}

export default Parser
