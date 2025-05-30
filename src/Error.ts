class RestClientException extends Error {
    message: string

    constructor(message: string) {
        super()
        this.message = message
    }
}

export { RestClientException }
