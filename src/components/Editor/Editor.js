import React, { Component } from 'react'
import axios from 'axios'

import CustomizerWorldEditor from './CustomizerWorldEditor'
import CustomizerWorldListItem from './CustomizerWorldListItem'
import CustomizerGroupEditor from './CustomizerGroupEditor'
import CustomizerCategoryEditor from './CustomizerCategoryEditor'
import FormWithText from './FormWithText'

import './Editor.css'

// import Popup from '../Popup'

const apiEndpoint = process.env.REACT_APP__API_ENDPOINT
const accessToken = process.env.REACT_APP__ACCESS_TOKEN

const requestConfig = {
    headers: {
        'Authorization': `Bearer ${accessToken}`
    }
}

class Editor extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            userData: {},

            customizers: [],

            currentCustomizerIndex: null,
            currentGroupIndex: null,
            currentCategoryIndex: null,
            
            newWorldName: ''
        }
    }

    async componentDidMount() {

        const res = await axios.get(
            `${apiEndpoint}/user`,
            requestConfig
        )

        const username = res.data.username

        console.log('username:', username)

        const res2 = await axios.get(
            `${apiEndpoint}/users/${username}/customizers`,
            {
                ...requestConfig,
                params: {
                    include_groups: true
                }
            }
        )

        const customizerWorlds = res2.data.map( customizer => ({
            ...customizer,
            synced: true
        }) )


        console.log('customizerWorlds:', customizerWorlds)

        this.setState({
            customizers: customizerWorlds,
            userData: {
                username
            }
        })

        // TODO do smth with worlds
    }

    onWorldClick = index => {
        this.setState({
            currentCustomizerIndex: index,
            currentGroupIndex: null,
            currentCategoryIndex: null
        })
    }

    onGroupClick = index => {
        this.setState({
            currentGroupIndex: index,
            currentCategoryIndex: null
        })
    }

    onCategoryClick = index => {
        this.setState({
            currentCategoryIndex: index
        })
    }

    onAddWorldSubmit = async e => {
        e.preventDefault()

        const {
            userData: { username },
            customizers: currentCustomizersList,
            newWorldName
        } = this.state

        const { data } = await axios.post(
            `${apiEndpoint}/users/${username}/customizers`, // could use apiEndpoint/customizers
            {
                name: newWorldName
            },
            requestConfig
        )


        const newCustomizer = {
            id: data.id,
            name: newWorldName,
            groups: [],
            synced: true
        }

        this.setState({
            customizers: [ ...currentCustomizersList, newCustomizer ],
            newWorldName: ''
        })

    }

    onNewWorldNameChange = e => {
        this.setState({
            newWorldName: e.target.value
        })
    }

    onAddGroup = group => {
        const customizer = this.getCurrentCustomizer()
        customizer.groups.push( group )
        customizer.synced = false

        this.setCurrentCustomizer( customizer )
    }

    onEditGroup = newGroup => {
        const { currentGroupIndex } = this.state

        if ( currentGroupIndex === null ) {
            return
        }

        const customizer = this.getCurrentCustomizer()
        customizer.groups[ currentGroupIndex ] = newGroup
        customizer.synced = false

        this.setCurrentCustomizer( customizer )
    }

    onRemoveGroup = () => {
        const { currentGroupIndex } = this.state

        if ( currentGroupIndex === null ) {
            return
        }

        const customizer = this.getCurrentCustomizer()
        customizer.groups.splice( currentGroupIndex, 1 )
        customizer.synced = false

        this.setCurrentCustomizer( customizer )
    }


    onAddCategory = category => {
        const group = this.getCurrentGroup()

        if ( !group ) {
            return
        }

        group.categories.push( category )

        this.onEditGroup( group )
    }

    onEditCategory = newValue => {
        const { currentCategoryIndex } = this.state
        const currentGroup = this.getCurrentGroup()

        if ( !currentGroup || currentCategoryIndex === null ) {
            return
        }

        currentGroup.categories[ currentCategoryIndex ] = newValue

        this.onEditGroup( currentGroup )
    }

    onRemoveCategory = () => {
        const { currentCategoryIndex } = this.state
        const currentGroup = this.getCurrentGroup()

        if ( !currentGroup || currentCategoryIndex === null ) {
            return
        }

        currentGroup.categories.splice( currentCategoryIndex, 1 )

        this.onEditGroup( currentGroup )
    }

    onWorldNameChange = e => {
        const currentCustomizer = this.getCurrentCustomizer()

        const processedCustomizer = {
            ...currentCustomizer,
            name: e.target.value,
            synced: false
        }

        this.setCurrentCustomizer( processedCustomizer )
    }

    onSaveChanges = async () => {
        const currentCustomizer = this.getCurrentCustomizer()

        if ( ! currentCustomizer ) {
            return
        }

        if ( currentCustomizer.deleted ) {
            const { id } = currentCustomizer

            try {
                const { status } = await axios.delete(
                    `${apiEndpoint}/customizers/${id}`,
                    requestConfig
                )

                if ( status === 204 ) {
                    const { currentCustomizerIndex } = this.state

                    this.deleteCustomizer( currentCustomizerIndex )
                } else {
                    console.log( 'Could not delete!' )
                }
            } catch ( err ) {
                console.error( err )
            }

            return
        }

        const { id, name, groups } = currentCustomizer

        const { status } = await axios.put(
            `${apiEndpoint}/customizers/${id}`,
            {
                name,
                groups
            },
            requestConfig
        )

        if ( status === 200 ) {
            this.setCurrentCustomizer( {
                ...currentCustomizer,
                synced: true
            } )
        }

    }

    getCurrentCustomizer = () => {
        const { currentCustomizerIndex, customizers } = this.state

        return customizers[ currentCustomizerIndex ]
    }

    setCurrentCustomizer = newValue => {
        this.setCustomizerAtIndex( newValue, this.state.currentCustomizerIndex )
    }

    setCustomizerAtIndex = ( newValue, index ) => {
        const { customizers } = this.state

        this.setState({
            customizers: [
                ...customizers.slice( 0, index ),
                newValue,
                ...customizers.slice( index + 1, customizers.length )
            ]
        })
    }

    getCurrentGroup = () => {
        const { currentGroupIndex } = this.state

        const currentCustomizer = this.getCurrentCustomizer()

        return currentCustomizer && currentCustomizer.groups[ currentGroupIndex ]
    }

    deleteCustomizer = index => {
        const { customizers } = this.state

        this.setState({
            customizers: [
                ...customizers.slice( 0, index ),
                ...customizers.slice( index + 1, customizers.length )
            ],
            currentCustomizerIndex: null
        })
    }

    onMarkDeleted = index => {
        const {
            customizers: prevCustomizers
        } = this.state

        const customizer = prevCustomizers[ index ]
        customizer.deleted = true
        customizer.synced = false

        this.setCustomizerAtIndex( customizer, index )
    }

    render() {
        const { customizers, currentCustomizerIndex, currentGroupIndex, currentCategoryIndex } = this.state

        const addWorldForm = (
            <li key="add-world">
                <FormWithText
                    onSubmit = { this.onAddWorldSubmit }
                    textValue = { this.state.newWorldName }
                    onTextChange = { this.onNewWorldNameChange }
                    placeholder = "Name"
                    submitValue = "Add World"
                />
            </li>
        )

        const customizerListItems = [
            ...customizers.map( 
                ( customizer, index ) => (
                    <CustomizerWorldListItem
                        key = { customizer.id }
                        customizer = { customizer }
                        isSelected = { index === currentCustomizerIndex }
                        onWorldClick = { this.onWorldClick.bind( this, index ) }
                        onMarkDeleted = { this.onMarkDeleted.bind( this, index ) }
                        onSaveChanges = { this.onSaveChanges }
                    />
                )
            ),
            addWorldForm
        ]

        const currentCustomizer = customizers[ currentCustomizerIndex ]

        const currentGroup = currentCustomizer && currentCustomizer.groups[ currentGroupIndex ]

        const currentCategory = currentGroup && currentGroup.categories[ currentCategoryIndex ]

        const allCategories = currentCustomizer && currentCustomizer.groups.reduce(
            ( categories, group ) => categories.concat( group.categories ),
            []
        )

        return <div className = "editor">
            <div className = "customizers">
                <p>these are your worlds</p>
                <ul>
                    {customizerListItems}
                </ul>
            </div>

            <div className = "groups">
                <CustomizerWorldEditor
                    customizer = { currentCustomizer }
                    currentGroupIndex = { currentGroupIndex }
                    onGroupClick = { this.onGroupClick }
                    onAddGroup = { this.onAddGroup }
                    onRemoveGroup = { this.onRemoveGroup }
                    onEditGroup = { this.onEditGroup }
                    onNameChange = { this.onWorldNameChange }
                    onSave = { this.onSaveChanges }
                />
            </div>

            <div className = "categories">
                <CustomizerGroupEditor
                    group = { currentGroup }
                    onEditGroup = { this.onEditGroup }
                    onRemoveGroup = { this.onRemoveGroup }
                    onAddCategory = { this.onAddCategory }
                    onCategoryClick = { this.onCategoryClick }
                />
            </div>

            <div className = "category">
                <CustomizerCategoryEditor
                    category = { currentCategory }
                    onEditCategory = { this.onEditCategory }
                    allCategories = { allCategories }
                />
            </div>
        </div>
    }
}

export default Editor