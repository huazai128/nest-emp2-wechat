

import { useContext } from 'react'
import { StoreContext } from '@src/components/StoreProvider'

const useRootStore = () => {
    return useContext(StoreContext)
}

export default useRootStore