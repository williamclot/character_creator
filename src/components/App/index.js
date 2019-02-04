import React from 'react'
import { Provider } from 'react-redux'

import ConnectedApp from './App'
import store from '../../store'


export default props => (
    <Provider store = { store }>
        <ConnectedApp {...props} />
    </Provider>
)
