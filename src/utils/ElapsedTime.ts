const elapsedTime = <T>(fn: () => T): [T, number] => {
    const start = performance.now()
    const result = fn()

    return [result, performance.now() - start]
}

export default elapsedTime
