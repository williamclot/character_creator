import React from 'react'

const ListWithSeparator = ({
    className,
    children,
    separator,
    ...props
}) => {
    const [head, tail] = children

    const separatedChildren = tail.reduce(
        (prev, curr) => prev.concat( separator, curr ),
        [head]
    )

    return (
        <div
            className = { className }
            { ...props }
        >
            { separatedChildren }
        </div>
    )
}

export default ListWithSeparator
