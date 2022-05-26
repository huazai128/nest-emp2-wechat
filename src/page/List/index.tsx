import React, { Fragment, useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './style.scss'

const List = () => {
    const [isVisible, setIsVisible] = useState<boolean>(false)
    const msObserver = useRef<MutationObserver>()
    const itOberser = useRef<IntersectionObserver>()
    useEffect(() => {
        // 针对曝光研究
        itOberser.current = new IntersectionObserver(function (entries, observer: IntersectionObserverInit) {
            entries.forEach((entry) => {
                // 检查元素发生了碰撞
                const nodeRef = entry.target as HTMLElement
                const att = nodeRef.getAttribute('data-visible')
                if (entry.isIntersecting && entry.intersectionRatio >= 0.85) {
                    // itOberser.current?.unobserve(nodeRef);
                    nodeRef.setAttribute('data-visible', 'y')
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: [0.1, 0.85]
        })

        const nodes = (document as Document).querySelectorAll('.on-visible')
        nodes.forEach((child) => {
            itOberser.current?.observe(child)
        });

        msObserver.current = new MutationObserver(function (mutationsList: MutationRecord[], observer: MutationObserver) {
            // mutationsList参数是个MutationRecord对象数组，描述了每个发生的变化
            mutationsList.forEach(function (mutation: MutationRecord) {
                console.log('元素', mutation)
                const addedNodes = mutation.addedNodes
                addedNodes.forEach((node: any) => {
                    const isS = node.classList.contains('on-visible')
                    isS && itOberser.current?.observe(node)
                    const nodes = node.querySelectorAll('.on-visible')
                    nodes?.forEach((child: HTMLElement) => {
                        itOberser.current?.observe(child)
                    });
                })
            });
        })

        msObserver.current.observe(document.body, {
            attributes: true,
            characterData: true,
            childList: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true,
        })
    }, [])

    const nodeRef = (document as Document).getElementById("emp-root")
    return (
        <Fragment>
            <div className='ls-box flex flex-center'>
                <div className='ls-btn on-visible' onClick={() => setIsVisible(true)}>按钮</div>
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