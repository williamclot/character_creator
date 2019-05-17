import React, { Component } from 'react'
import cn from 'classnames'

import CanvasContainer from '../../CanvasContainer'

import threeUtils from './three'

import NumberInput from '../../MyInput'
import commonStyles from '../index.module.css'
import styles from './index.module.css'

export default class AdjustAttachpoints extends Component {
    constructor( props ) {
        super( props )

        const { currentAttachPoint, attachPointsPositions } = props
        const { x: posX, y: posY, z: posZ } = attachPointsPositions[ currentAttachPoint ] || { x: 0, y: 0, z: 0 }

        this.state = {
            posX,
            posY,
            posZ,
        }
    }
    
    componentDidMount() {
        const {
            currentObjectChild,
            uploadedObjectGeometry,
            position,
            rotation,
            scale,
        } = this.props
        const { posX, posY, posZ } = this.state

        threeUtils.resetRendererSize()

        threeUtils.addObject( uploadedObjectGeometry, {
            position,
            rotation,
            scale
        })

        const childPosition = {
            x: posX,
            y: posY,
            z: posZ,
        }

        threeUtils.setSpherePosition( childPosition )
        
        const hasChild = Boolean( currentObjectChild )

        if ( hasChild ) {
            /**
             * TODO: get directly from sceneManager
             * 
             * Assumption: first child is the group containing the mesh,
             * other children are bones and need to be filtered out
             */
            const childMesh = currentObjectChild.children[0]
            threeUtils.addChildObject( childMesh, childPosition )
        }

        threeUtils.renderScene()

        threeUtils.addEventListener( 'translate', this.handleGizmoPositionChange )
    }

    componentWillUnmount() {
        threeUtils.clearObjects()

        threeUtils.removeEventListener( 'translate', this.handleGizmoPositionChange )
    }

    /*
    componentDidUpdate( prevProps ) {
        let shouldRender = false

        const prevGeometry = prevProps.uploadedObjectGeometry
        const currGeometry = this.props.uploadedObjectGeometry

        if ( prevGeometry !== currGeometry ) {
            this.resetCamera()
            this.resetRenderer()
            
            const oldMesh = this.mesh

            this.mesh = new Mesh(
                currGeometry,
                this.material
            )

            const {
                position: { x: posX, y: posY, z: posZ },
                rotation: { x: rotX, y: rotY, z: rotZ },
                scale
            } = this.props

            this.mesh.position.set( posX, posY, posZ )
            this.objectContainer.rotation.set( rotX, rotY, rotZ )
            this.objectContainer.scale.setScalar( scale )

            this.objectContainer.remove( oldMesh )
            this.objectContainer.add( this.mesh )
            
            shouldRender = true
        }

        const prevAttachpoints = prevProps.attachPointsPositions
        const thisAttachPoints = this.props.attachPointsPositions

        if ( prevAttachpoints !== thisAttachPoints ) {
            for ( let key of Object.keys( thisAttachPoints ) ) {
                if ( prevAttachpoints[ key ] !== thisAttachPoints[ key ] ) {
                    const { x, y, z } = thisAttachPoints[ key ]
                    
                    this.sphere.position.set( x, y, z )

                    shouldRender = true
                }
            }
        }

        if ( prevProps.attachPointsToPlace !== this.props.attachPointsToPlace ) {
            const { x, y, z } = this.getPosition()
            this.sphere.position.set( x, y, z )
            
            const oldChild = this.childMesh
            this.sphere.remove( oldChild )
            
            const attachPointName = this.getAttachpoint()
            const childMesh = this.props.currentObjectChildren[ attachPointName ]
            
            if ( childMesh ) {
                this.childMesh = childMesh.clone()
                this.sphere.add( this.childMesh )
            }

            shouldRender = true
        }
    }
    */

    handleGizmoPositionChange = ({ position: { x: posX, y: posY, z: posZ } }) => {
        this.setState({
            posX,
            posY,
            posZ
        })
    }

    onPositionXChange = value => {
        this.setState({
            posX: value
        })

        threeUtils.setSpherePosition({
            x: value,
            y: this.state.posY,
            z: this.state.posZ,
        })

        threeUtils.renderScene()
    }

    onPositionYChange = value => {
        this.setState({
            posY: value
        })

        threeUtils.setSpherePosition({
            x: this.state.posX,
            y: value,
            z: this.state.posZ,
        })

        threeUtils.renderScene()
    }

    onPositionZChange = value => {
        this.setState({
            posZ: value
        })

        threeUtils.setSpherePosition({
            x: this.state.posX,
            y: this.state.posY,
            z: value,
        })

        threeUtils.renderScene()
    }

    handleNext = () => {
        const {
            currentAttachPoint,
            onAttachPointPositionChange,
            nextStep,
        } = this.props
        const {
            posX, posY, posZ,
        } = this.state

        onAttachPointPositionChange( currentAttachPoint, {
            x: posX,
            y: posY,
            z: posZ,
        })

        nextStep()
    }

    render() {
        const {
            // currentCategory,

            previousStep
        } = this.props
        const { posX, posY, posZ } = this.state

        const className = cn(
            commonStyles.wizardStep,
            styles.adjustTransforms
        )

        return (
            <div
                className = { className }
            >

                <CanvasContainer
                    className = { styles.previewCanvas}
                    domElement = { threeUtils.getCanvas() }
                />
                
                <div className = { styles.sideView } >

                    <div className = { styles.inputsContainer } >
                        <div className = {cn( styles.inputGroup, styles.position )} >
                            <div className = { styles.label } >
                                Position
                            </div>
                            <div className = { styles.axes } >
                                <NumberInput
                                    axis = {'X'}
                                    value = { posX }
                                    onChange = { this.onPositionXChange }
                                />
                                <NumberInput
                                    axis = {'Y'}
                                    value = { posY }
                                    onChange = { this.onPositionYChange }
                                />
                                <NumberInput
                                    axis = {'Z'}
                                    value = { posZ }
                                    onChange = { this.onPositionZChange }
                                />
                            </div>
                        </div>
                        
                    </div>
                    
                    <div className = { styles.buttonsContainer } >
                        <div
                            className = {cn( commonStyles.button, styles.button )}
                            onClick = { previousStep }
                        >
                            Back
                        </div>
                        <div
                            className = {cn( commonStyles.button, styles.button )}
                            onClick = { this.handleNext }
                        >
                            Next
                        </div>
                    </div>

                </div>

                <div className = { styles.title } >
                    <h4>
                        Position and Resize
                    </h4>
                </div>

            </div>
        )
    }
}