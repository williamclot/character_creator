import React, { Component } from 'react'
import axios from 'axios'

import { name, groups } from './lib/user_my-human-world.json'

import { apiEndpoint, accessToken, requestConfig, userName, customizerName } from './config'

class App extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            customizerName: name,
            groups,

            selectedCategoryPath: {
                groupIndex: null,
                categoryIndex: null
            },
            
            editMode: false
        }
    }

    setSelectedGroup = index => {
        this.setState({
            selectedCategoryPath: {
                groupIndex: index
            }
        })
    }

    getSelectedGroup = () => {
        const { groups, selectedCategoryPath } = this.state

        const { groupIndex, categoryIndex } = selectedCategoryPath

        return groups[ groupIndex ]
    }

    setSelectedCategory = index => {
        const { selectedCategoryPath } = this.state

        this.setState({
            selectedCategoryPath: {
                ...selectedCategoryPath,
                categoryIndex: index
            }
        })
    }

    getSelectedCategory = () => {
        const { categoryIndex } = this.state.selectedCategoryPath

        const selectedGroup = this.getSelectedGroup()

        return selectedGroup && selectedGroup.categories[ categoryIndex ]
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
        const { customizerName, groups } = this.state

        const selectedGroup = this.getSelectedGroup()
        const selectedCategory = this.getSelectedCategory()

        console.log( 'group', selectedGroup )
        console.log( 'category', selectedCategory )

        return <>
            <h1> {customizerName} </h1>
            
            <div>
                <ul>
                    {groups.map(
                        ( group, index ) => (
                            <li
                                key = { group.name }
                                onClick = { () => this.setSelectedGroup( index ) }
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
                                    onClick = { () => this.setSelectedCategory( index ) }
                                >
                                    { category.name }
                                </li>
                            )
                        )}
                    </ul>
                )}
            </div>
        </>
    }

}

export default App