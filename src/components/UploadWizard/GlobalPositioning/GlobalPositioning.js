import React, { Component } from 'react'
import cn from 'classnames'

import CanvasContainer from '../../CanvasContainer'

import threeUtils from './three'

import styles from './index.module.css'
import commonStyles from '../index.module.css'
import { object3dFind } from '../../../util/three-helpers';

export default class GlobalPositioning extends Component {
    componentDidMount() {
        const {
            currentObjectParent,
            uploadedObjectGeometry,
        } = this.props

        const parentObject = currentObjectParent && object3dFind( currentObjectParent, object => object.isMesh )
        const parentGeometry = parentObject && parentObject.geometry

        threeUtils.init( uploadedObjectGeometry, parentGeometry )

        threeUtils.renderScene()
    }

    componentWillUnmount() {
        threeUtils.clearObjects()
    }

    handleConfirm = () => {
        this.props.onConfirm()
    }

    handleReject = () => {
        this.props.nextStep()
    }

    handleBack = () => {
        this.props.previousStep()
    }

    render() {
        return (
            <div className = {cn( commonStyles.wizardStep, styles.container )}>

                <CanvasContainer
                    className = { styles.canvas }
                    domElement = { threeUtils.getCanvas() }
                />

                <div className = { styles.title }>
                    Does this look alright to you?
                </div>

                <div className = { styles.buttonsContainer } >

                    <div
                        className = {cn( commonStyles.button, styles.button )}
                        onClick = { this.handleBack }
                    >
                        Back
                    </div>

                    <div
                        className = {cn(
                            commonStyles.button,
                            styles.button,
                            styles.cancellationMark
                        )}
                        onClick = { this.handleReject }
                    >
                        No 🗙
                    </div>

                    <div
                        className = {cn(
                            commonStyles.button,
                            styles.button,
                            styles.confirmationMark
                        )}
                        onClick = { this.handleConfirm }
                    >
                        Yes 🗸
                    </div>

                </div>
            </div>
        )
    }
}