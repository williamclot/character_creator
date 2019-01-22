import React, { Component } from 'react'

import ThreeContainer from './ThreeContainer'

import { name, groups } from '../lib/user_my-human-world.json'

import { apiEndpoint, accessToken, requestConfig, userName, customizerName } from '../config'

class App extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            customizerName: name,
            groups,
            
            testKey: 'test',
            
            editMode: false
        }

        window.test = k => this.setState({ testKey: k })
    }


    getSelectedGroup = () => {
        const { selectedGroupIndex } = this.props
        const { groups } = this.state

        return groups[ selectedGroupIndex ]
    }


    getSelectedCategory = () => {
        const { selectedCategoryIndex } = this.props

        const selectedGroup = this.getSelectedGroup()

        return selectedGroup && selectedGroup.categories[ selectedCategoryIndex ]
    }

    /*
    async componentDidMount() {
        const res = await axios.get(
            `${apiEndpoint}/users/${userName}/customizers/${customizerName}`
        )

        const { name, groups } = res.data

        this.setState({
            customizerName: name,
            groups
        })
    }
    */

    render() {
        const {
            selectedGroupIndex, selectedCategoryIndex,
            onGroupClick, onCategoryClick
        } = this.props
        
        const { customizerName, groups } = this.state

        const selectedGroup = this.getSelectedGroup()
        const selectedCategory = this.getSelectedCategory()


        return <>
            <h1> {customizerName} </h1>
            
            <div>
                <ul>
                    {groups.map(
                        ( group, index ) => (
                            <li
                                key = { group.name }
                                onClick = { () => onGroupClick( index ) }
                                selected = { index === selectedGroupIndex }
                            >
                                { group.name }
                            </li>
                        )
                    )}
                </ul>
            </div>

            <div>
                {selectedGroup && (
                    <ul>
                        {selectedGroup.categories.map(
                            ( category, index ) => (
                                <li
                                    key = { category.id }
                                    onClick = { () => onCategoryClick( index ) }
                                    selected = { index === selectedCategoryIndex }
                                >
                                    { category.name }
                                </li>
                            )
                        )}
                    </ul>
                )}
            </div>

            <ThreeContainer
                testKey = { this.state.testKey }
                width = { window.innerWidth }
                height = { window.innerHeight }
            />
        </>
    }

}

export default App