import React, { useEffect } from 'react'
import ErrorBoundaryHoc from '@src/components/ErrorBoundary'

const Test = () => {
    useEffect(() => {
        const i = 1
        // i.map(() => { return 1 })
    }, [])

    return (
        <div>1212</div>
    )
}

export default ErrorBoundaryHoc(Test, 'Test')