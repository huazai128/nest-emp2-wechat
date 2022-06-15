import React, { Fragment, useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import Test from './comoponents/Test'
import './style.scss'

const List = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const nodeRef = (document as Document).getElementById("emp-root")
    useEffect(() => {
        // const nodeRef = document.createElement('script') // 静态资源报错
        // nodeRef.src = 'https://charge-test.markiapp.com/js/commons.5577c889as.js'
        // document.body.appendChild(nodeRef)

        // const i = 1
        // i.map(() => { }) // JS 错误

        // Promise.reject('中文')
        // Promise.resolve().then(() => console.log(c));


    }, [])

    return (
        <Fragment>
            <div className='ls-box flex flex-center'>
                <Test />
                {/* <img src="http://localhost:8888/nottrue.jpg" /> */}
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