import axios, { AxiosRequestConfig } from 'axios'
import { ParsedRequest } from './types'
import UrlResolver from './UrlResolver'

class HttpRequest {
    private parsed: ParsedRequest

    constructor(parsed: ParsedRequest) {
        this.parsed = parsed
    }

    public send() {
        const urlResolver = new UrlResolver(this.parsed.headers)
        const url = urlResolver.buildFullUrl(this.parsed.path)

        console.log(`\n==> ${this.parsed.method} ${url}`)
        console.log('==> Headers:\n', this.parsed.headers)
        console.log('\n==> Body:\n', this.parsed.body || '(empty)')

        const config: AxiosRequestConfig = {
            method: this.parsed.method,
            url,
            headers: this.parsed.headers,
            data: this.parsed.body ? JSON.parse(this.parsed.body) : undefined,
            validateStatus: () => true,
            timeout: 5000,
        }

        console.log('\n==> Sending request...')

        axios
            .request(config)
            .then((res) => {
                console.log(`\n==> HTTP/1.1 ${res.status} ${res.statusText}`)
                for (const [key, value] of Object.entries(res.headers)) {
                    const formattedKey = key
                        .split('-')
                        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
                        .join('-')
                    console.log(`${formattedKey}: ${value}`)
                }

                console.log('\n==> Body:\n', JSON.stringify(res.data, null, 4))
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    console.error(`\n==> Error: ${error.message}`)
                    if (error.response) {
                        console.error(`HTTP/1.1 ${error.response.status} ${error.response.statusText}`)
                        console.error('Response Headers:', error.response.headers)
                        console.error('Response Body:', error.response.data)
                    }
                } else {
                    console.error(`\n==> Unexpected Error: ${error}`)
                }
            })
    }
}

export default HttpRequest
