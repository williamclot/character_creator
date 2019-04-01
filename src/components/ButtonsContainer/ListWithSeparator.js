import React, { Children, cloneElement } from 'react'

const ListWithSeparator = ({
    className,
    children,
    separator,
    ...props
}) => {
    const [head, ...tail] = children

    return (
        <div
            className = { className }
            { ...props }
        >
            { head }
            { Children.map(tail, ( child, index ) => (
                <>
                    { cloneElement(separator, { key: index }) }
                    { child }
                </>
            ))}
        </div>
    )
}

export default ListWithSeparator
