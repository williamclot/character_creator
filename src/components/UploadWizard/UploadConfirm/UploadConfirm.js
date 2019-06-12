import React, { Component } from 'react'
import cn from 'classnames'

import Tutorial from '../Tutorial'
import ImportButton from '../../ImportButton'

import PreviewText from './PreviewText';
import PreviewFile from './PreviewFile';
import Delimiter from './Delimiter';
import CanvasContainer from '../../CanvasContainer'

import threeUtils from './three'

import commonStyles from '../index.module.css'
import styles from './index.module.css'

class UploadConfirm extends Component {
    constructor( props ) {
        super( props )

        this.state = {
            tutorialHidden: true,

            name: props.name,
            img: null
        }
    }
    
    componentDidMount() {
        const {
            uploadedObjectGeometry,
        } = this.props

        threeUtils.init( uploadedObjectGeometry )

        threeUtils.renderScene()
    }

    componentWillUnmount() {
        threeUtils.clearObjects()
    }

    handleCancel = () => {
        this.props.onCancel()
    }

    handleNameChange = e => {
        this.setState({
            name: e.target.value
        })
    }

    handleNext = async () => {
        const { onNameChange, setImage, onNext } = this.props
        const { name, img } = this.state

        onNameChange( name )

        onNext()

        if ( img ) {

            setImage( img.objectURL )

        } else {

            const imgBlob = await threeUtils.saveImage()
        
            const objectURL = URL.createObjectURL( imgBlob )
    
            setImage( objectURL )

        }
    }

    toggleTutorial = () => {
        this.setState( state => ({
            tutorialHidden: !state.tutorialHidden
        }))
    }

    handleFileLoaded = ( filename, objectURL ) => {
        this.setState({
            img: {
                filename,
                objectURL
            }
        })
    }

    handleRemoveImage = () =>  {
        console.log('image removed')

        const { img } = this.state

        if ( img ) URL.revokeObjectURL( img.objectURL )

        this.setState({
            img: null
        })
    }

    renderPreview() {
        const { img } = this.state

        const showImage = Boolean(img)

        return (
            showImage ? (
                <img
                    className = { styles.img }
                    src = { img.objectURL }
                />
            ) : (
                <CanvasContainer
                    className = { styles.canvas }
                    domElement = { threeUtils.getCanvas() }
                />
            )
        )
    }

    render() {
        const {
            currentCategory,
        } = this.props
        const {
            tutorialHidden,
            name,
            img,
        } = this.state

        const showImage = Boolean(img)

        const className = cn(
            commonStyles.wizardStep,
            styles.container
        )

        return (
            <div className = { className } >
                <div
                    className = { styles.uploadConfirm }
                >
                    <h2> Add Part </h2>

                    <div className = { styles.gridView } >

                        <span className = { styles.label } >
                            Part Type
                            <span
                                className = { styles.questionMark }
                                onClick = { this.toggleTutorial }
                            >?</span>
                        </span>
                        <span className = { styles.view } >
                            { currentCategory && currentCategory.label }
                        </span>

                        <span className = { styles.label } >
                            Part Name
                        </span>
                        <input
                            className = {cn( styles.view, styles.input )}
                            type = "text"
                            value = { name }
                            onChange = { this.handleNameChange }
                        />

                        <div className = { styles.label }>
                            <span>
                                Part Preview Icon
                            </span>
                        </div>

                        <div className = { styles.view }>
                            
                            {showImage ? (
                                <PreviewFile
                                    filename = { img.filename }
                                    onRemove = { this.handleRemoveImage }
                                />
                            ) : (
                                <ImportButton
                                    className = { styles.ImportButton }
                                    onFileLoaded = { this.handleFileLoaded }
                                    accept = "image/png, image/jpeg"
                                >
                                    <PreviewText />
                                </ImportButton>

                            )}
                        </div>

                        {!showImage && (
                            <div className = { styles.view }>
                                <Delimiter />
                            </div>
                        )}

                        <div className = { styles.label }>
                            <p className = { styles.previewInstructions } >
                                (Set the Icon by dragging to rotate the part)
                            </p>
                        </div>
                        <div className = {cn( styles.view, styles.previewContaier )} >

                            {this.renderPreview()}

                            <div className = { styles.canvasTitle } > { name } </div>
                        </div>
                        
                        <div className = {cn( styles.view, styles.buttonsContainer ) } >
                            <div
                                className = {cn( commonStyles.button, styles.button )}
                                onClick = { this.handleCancel }
                            >
                                Cancel
                            </div>

                            <div
                                className = {cn( commonStyles.button, styles.button )}
                                onClick = { this.handleNext }
                            >
                                Next
                            </div>
                        </div>

                    </div>

                </div>

                <div
                    className = {cn(
                        styles.tutorial,
                        tutorialHidden && styles.hidden
                    )}
                >
                    <Tutorial />
                </div>
            </div>
        )
    }
}

export default UploadConfirm