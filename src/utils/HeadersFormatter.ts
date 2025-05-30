import { AxiosResponse } from 'axios'
import { Headers } from '../types'

export default (headers: AxiosResponse): Headers => {
    const result: Headers = {}

    for (const [key, value] of Object.entries(headers.headers)) {
        const formattedKey = key
            .split('-')
            .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
            .join('-')
        result[formattedKey] = value
    }

    return result
}
