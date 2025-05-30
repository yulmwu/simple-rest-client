import axios, { AxiosRequestConfig } from 'axios'

import { ClientOutput, ParsedRequest } from './types'
import UrlResolver from './UrlResolver'
import headersFormatter from './utils/HeadersFormatter'

class HttpRequestClient {
    private parsed: ParsedRequest

    constructor(parsed: ParsedRequest) {
        this.parsed = parsed
    }

    public async send(): Promise<ClientOutput> {
        const urlResolver = new UrlResolver(this.parsed.headers)
        const url = urlResolver.buildFullUrl(this.parsed.path)

        const config: AxiosRequestConfig = {
            method: this.parsed.method,
            url,
            headers: this.parsed.headers,
            data: this.parsed.body,
            validateStatus: () => true,
            timeout: 5000,
        }

        try {
            const res = await axios.request(config)

            if (typeof res.data === 'object' && res.data !== null) res.data = JSON.stringify(res.data, null, 4)

            const output: ClientOutput = {
                status: res.status,
                statusText: res.statusText,
                headers: headersFormatter(res),
                data: res.data,
            }

            return output
        } catch (error) {
            let errorMessage: string

            if (axios.isAxiosError(error)) {
                errorMessage = `Error: ${error.message}`

                if (error.response) {
                    errorMessage += `\nHTTP/1.1 ${error.response.status} ${error.response.statusText}`
                    errorMessage += `\nResponse Headers: ${JSON.stringify(error.response.headers, null, 4)}`
                    errorMessage += `\nResponse Body: ${error.response.data}`
                }
            } else errorMessage = `Unexpected Error: ${error}`

            throw new Error(errorMessage)
        }
    }
}

export default HttpRequestClient
