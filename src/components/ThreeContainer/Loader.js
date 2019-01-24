import React from 'react'

const Loader = ({ loading }) => {
    const className = [
        'loader',
        ... loading ? ['loading'] : []
    ].join(' ')

    return (
        <div className = { className }>
            ...
        </div>
    )
}


export default Loader