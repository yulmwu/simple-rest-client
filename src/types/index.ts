export type Headers = Record<string, string>

export interface ParsedHttpStructure {
    method: string
    path: string
    lines: Array<string>
}

export interface ParsedRequest {
    method: string
    path: string
    headers: Headers
    body: string
}

export interface ClientOutput {
    status: number
    statusText: string
    headers: Headers
    data?: string
}

export type ContentType =
    | 'application/json'
    | 'application/xml'
    | 'text/plain'
    | 'text/html'
    | 'multipart/form-data'
    | 'application/x-www-form-urlencoded'

export type ContentParserOutput = object | string
