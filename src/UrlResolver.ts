import { RestClientException } from "./Error"

class UrlResolver {
    private headers: Record<string, string> = {}

    constructor(headers: Record<string, string> = {}) {
        this.headers = headers
    }

    private getOriginFromHeader(headerName: string): string | null {
        const value = this.headers[headerName]
        if (!value) return null

        try {
            return new URL(value).origin
        } catch {
            return null
        }
    }

    public buildFullUrl(path: string): string {
        if (/^https?:\/\//i.test(path)) return path

        const origin =
            this.getOriginFromHeader('Origin') ??
            this.getOriginFromHeader('Referer') ??
            (this.headers['Host'] ? `https://${this.headers['Host']}` : null)

        if (!origin) {
            throw new RestClientException('Cannot resolve full URL. Missing or invalid "Origin", "Referer", or "Host".')
        }

        return `${origin}${path}`
    }
}

export default UrlResolver
