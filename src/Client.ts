import axios, { AxiosRequestConfig } from 'axios'

import { ClientOutput, ParsedRequest } from './types'
import UrlResolver from './UrlResolver'
import headersFormatter from './utils/HeadersFormatter'

class HttpRequestClient {
    private parsed: ParsedRequest

    constructor(parsed: ParsedRequest) {
        this.parsed = parsed
    }

    public send<T>(): ClientOutput<T> {
        const urlResolver = new UrlResolver(this.parsed.headers)
        const url = urlResolver.buildFullUrl(this.parsed.path)

        const config: AxiosRequestConfig = {
            method: this.parsed.method,
            url,
            headers: this.parsed.headers,
            data: this.parsed.body ? JSON.parse(this.parsed.body) : undefined,
            validateStatus: () => true,
            timeout: 5000,
        }

        let errorMessage

        const output: ClientOutput<T> = {
            status: 0,
            statusText: '',
            headers: {},
        }

        axios
            .request(config)
            .then((res) => {
                output.status = res.status
                output.statusText = res.statusText
                output.headers = headersFormatter(res)
                output.data = res.data
            })
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    errorMessage = `Error: ${error.message}`

                    if (error.response) {
                        errorMessage += `\nHTTP/1.1 ${error.response.status} ${error.response.statusText}`
                        errorMessage += `\nResponse Headers: ${JSON.stringify(error.response.headers, null, 4)}`
                        errorMessage += `\nResponse Body: ${error.response.data}`
                    }
                } else errorMessage = `Unexpected Error: ${error}`
            })

        if (errorMessage) throw Error(errorMessage)

        return output
    }
}

export default HttpRequestClient
