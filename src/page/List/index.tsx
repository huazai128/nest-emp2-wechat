import React, { Fragment, useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './style.scss'

const List = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const nodeRef = (document as Document).getElementById("emp-root")
    useEffect(() => {
        console.log('===')
        const i = 1
        i.map(() => { })
    }, [])

    return (
        <Fragment>
            <div className='ls-box flex flex-center'>
                <div className='ls-btn on-visible' data-log={1212} onClick={() => setIsVisible(true)}>按钮</div>
            </div>
            {
                isVisible && nodeRef && createPortal(
                    <div className='y-box on-visible'>
                        <div className='on-visible' onClick={() => setIsVisible(false)}>隐藏</div>
                    </div>,
                    nodeRef
                )
            }
        </Fragment>

    )
}

export default List