import React, { Component } from 'react'

// import { defaultCategories, defaultObjectTypes } from '../../util/category' // TODO remove

import axios from 'axios'

import './SideView.css'

const CategoryViewItem = ({ name, img, objectTypes, setSelectedType, selectedType }) => {

    const typeViewList = objectTypes.map( type => 
        <TypeViewItem
            { ...type }
            key = { type.id }
            isSelected = { type === selectedType }
            onClick = { () => setSelectedType( type ) }
        />   
    )

    return (
        <li
            className = "category-item"
        >
            <div className = "category-item__label">
                { name }
                {/* <img src = { img } alt = { name } /> */}
            </div>

            <ul className = "types-list" >
                { typeViewList }
            </ul>
        </li>
    )
}

const TypeViewItem = ({ label, attachmentPoints, isSelected, onClick }) => {
    const className = `type-item ${ isSelected ? "selected" : "" }`

    // const attachmentPointsList = [ ...attachmentPoints ].map( attachPoint =>
    //     <li key = { attachPoint }>
    //         { attachPoint }
    //     </li>
    // )

    return (
        <li
            className = { className }
            onClick = { onClick }
        >
            { label }
            {/* Attachment points:
            <ul className = "attachpoint-list">
                { attachmentPointsList }
            </ul> */}
        </li>
    )
}

class SideView extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            categories: [],
        }
    }
    
    async componentDidMount() {
        const apiEndpoint = process.env.REACT_APP__API_ENDPOINT
        const accessToken = process.env.REACT_APP__ACCESS_TOKEN

        const requestConfig = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        }

        const res = await axios.get(
            `${apiEndpoint}/user`,
            requestConfig
        )

        const username = res.data.username

        const res2 = await axios.get(
            `${apiEndpoint}/users/${username}/customizers`,
            requestConfig
        )

        const customizerWorlds = res2.data

        // TODO do smth with worlds
    }

    render() {
        const { categories } = this.state


        const categoryViewList = categories.map( categoryData => 
            <CategoryViewItem
                { ...categoryData }
                key = { categoryData.name }
                setSelectedType = { this.props.setSelectedType }
                selectedType = { this.props.selectedType }
            />
        )
        
        return (
            <div className = "side-view">
                <ul className = "category-list">
                    { categoryViewList }
                </ul>
            </div>
        );
    }
}

export default SideView
