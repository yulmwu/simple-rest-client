import { ContentParserOutput, ContentType } from '../types'

export default (content: string, contentType: ContentType): ContentParserOutput => {
    switch (contentType) {
        case 'application/json':
            try {
                return JSON.parse(content)
            } catch (error) {
                throw new Error(`Invalid JSON content: ${error}`)
            }
        case 'application/x-www-form-urlencoded':
            const params = new URLSearchParams(content)
            const result: Record<string, string> = {}
            for (const [key, value] of params.entries()) {
                result[key] = value
            }
            return result
        case 'text/plain':
        case 'text/html':
            return content
        default:
            throw new Error(`Unsupported content type: ${contentType}`)
    }
}
