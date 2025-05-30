type Headers = Record<string, string>;

interface ParsedHttpStructure {
    method: string
    path: string
    lines: Array<string>
}

interface ParsedRequest {
    method: string
    path: string
    headers: Headers
    body: string
}

interface ClientOutput<T> {
    status: number
    statusText: string
    headers: Headers
    data?: T
}

export type { Headers, ParsedHttpStructure, ParsedRequest, ClientOutput }
