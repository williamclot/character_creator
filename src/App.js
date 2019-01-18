import React, { Component } from 'react'
import axios from 'axios'

import GizmoModes from './components/GizmoModes'
import SideView from './components/SideView'
import ObjectLoader from './components/ObjectLoader';



class ThreeApp extends Component {

    constructor( props ) {
        super( props )

        this.state = {
            selectedType: null,
            currentAttachPoint: null,
            attachPoints: {},
            pivotPoint: null,
        }
    }

    componentDidMount() {
        /******************* INITIALIZE THREE VARIABLES ******************/
        /** This will contain the group and everything else */
        this.scene = initScene()
    
        this.camera = initCamera()
        this.renderer = initRenderer( this.canvas )
        this.orbitControls = initControls( this.camera, this.canvas )
        this.transformControls = new TransformControls( this.camera, this.canvas )

        this.rootGroup = new Group
        
        /** This group will contain all the meshes but not the floor, the lights etc... */
        this.objectsGroup = new Group
        
        /** this group will contain all the attachment points for the current loaded object type */
        this.attachPointsGroup = new Group
        
        this.rootGroup.add( this.objectsGroup, this.attachPointsGroup )

        const lights = initLights();
        const floor = initFloor();
        const gridHelper = initGridHelper();

        /***************************** UTILS *****************************/

        this.surfaceFinder = new SurfaceFinder( this.camera, this.objectsGroup )

        this.attachpointsMap = {}

        
        /******************** ADD EVERYTHING TO SCENE ********************/
        this.scene.add(
            this.rootGroup, this.transformControls,
            /* floor, */ gridHelper, ...lights
        )

        // render first time
        this.renderScene()


        /********************** BIND EVENT LISTENERS *********************/
        
        // can add specific eventListener to most prop changes with event type: "<prop-name>-changed"
        this.orbitControls.addEventListener( 'change', throttle( this.renderScene ) )
        this.transformControls.addEventListener( 'change', ( this.onGizmoChange ) )

        this.canvas.addEventListener( 'click', this.onMouseClick )

        this.canvas.addEventListener( 'click', this.onDrop )

        this.canvas.addEventListener( 'dragover', defaultEventPreventer )

        this.canvas.addEventListener( 'drop', this.onDrop )


        /************************** DEVELOPMENT **************************/

        if ( process.env.NODE_ENV === 'development' ) {
            window.scene = this.scene;
            window.renderer = this.renderer;
            window.group = this.objectsGroup;
            window.camera = this.camera
            window.canvas = this.canvas
            window.export = this.onExport
        }
    }

    onGizmoChange = event => {

        const { object } = event.target

        if ( object ) {
            // this encourages each object managed by gizmo to handle the change
            object.dispatchEvent({
                type: "change"
            })
        }

        this.renderScene()
    }

    onMouseClick = ev => {

        ev.preventDefault();
        
        

        const raycaster = new Raycaster

        raycaster.setFromCamera( fromEvent( ev ), this.camera )

        const intersects = raycaster.intersectObject( this.attachPointsGroup, true )


        const mesh = intersects
            .map( intersect => intersect.object )
            .find( object => object instanceof Mesh )

        if( mesh ) {

            if ( this.transformControls.object !== mesh ) {
                this.transformControls.attach( mesh )
            }
        } else {
            if ( this.transformControls.object ) {
                this.transformControls.detach();
            }
        }


        this.renderScene()
    }


    onDrop = event => {

        event.preventDefault()
        
        const { currentAttachPoint } = this.state

        if ( ! currentAttachPoint || ! this.attachpointsMap[ currentAttachPoint ] ) {
            return
        }

        const computedPosition = this.surfaceFinder.find(
            fromEvent( event ), // mouse x,y coords
            this.camera.position.distanceTo( this.objectsGroup.position ) // default distance from camera if no mesh found
        )


        this.attachpointsMap[ currentAttachPoint ].position.copy( computedPosition )
        this.attachpointsMap[ currentAttachPoint ].visible = true


        this.setState({
            currentAttachPoint: null,
            attachPoints: {
                ...this.state.attachPoints,
                [currentAttachPoint]: {
                    ...computedPosition
                }
            }
        }, this.renderScene )

    }

    handleFileUpload = async ( blob, extension ) => {

        const { attachmentPoints: requiredAttachmentPoints } = this.state.selectedType
        
        const {
            object: objectToAdd,
            attachPoints: foundAttachPoints
        } = await getProcessedObject( blob, extension, requiredAttachmentPoints )


        // make loaded object transparent & opaque
        objectToAdd.traverse( makeTransparent )
        
        this.objectsGroup.add( objectToAdd )

        const attachPointsState = {}

        // now highlight attach points in 3d view
        for ( let key of requiredAttachmentPoints ) {
            
            let sphere
            const foundAttachPointPosition = foundAttachPoints[ key ]

            if ( foundAttachPointPosition ) {

                sphere = sphereFactory.yellow.buildSphere( foundAttachPointPosition )

                attachPointsState[ key ] = {
                    ...foundAttachPointPosition
                }

            } else {

                sphere = sphereFactory.yellow.buildSphere()
                sphere.visible = false
                
            }

            sphere.addEventListener( 'change', () => {
                const newPosition = { ...sphere.position }

                this.setState({
                    attachPoints: {
                        ...this.state.attachPoints,
                        [key]: newPosition
                    }
                })
            } )

            this.attachpointsMap[ key ] = sphere

            this.attachPointsGroup.add( sphere )
            
        }

        const redSphere = sphereFactory.red.buildSphere( objectToAdd.position )

        redSphere.addEventListener( 'change', () => {

            const newPosition = { ...redSphere.position }

            this.setState({ pivotPoint: newPosition })

        } )

        this.attachPointsGroup.add( redSphere )

        this.setState({
            attachPoints: attachPointsState,
            pivotPoint: { ...redSphere.position }
        }, this.renderScene )
    }

    onExport = async () => {

        const object = this.objectsGroup.children[0]

        if ( !object ) {
            console.log( 'Nothing to upload!' )
            return
        }

        const { attachPoints, pivotPoint } = this.state

        const metadata = JSON.stringify({
            attachPoints,
            pivotPoint
        })


        const mesh = object.getObjectByProperty( "isMesh", true )
        const binary =  await exportSTL( mesh )

        const blob = new Blob( [ binary ], { type: STL_MIME_TYPE } )


        const apiEndpoint = process.env.REACT_APP__API_ENDPOINT
        const accessToken = process.env.REACT_APP__ACCESS_TOKEN // TODO hard coded

        // step 1
        const { data } = await axios.post(
            `${apiEndpoint}/object`,
            {
                name: "myobject",
                files: [
                    {
                        filename: "myfile.stl",
                        size: blob.size
                    }
                ],
                customizer_metadata: metadata,
                customizer_category_id: 1, // TODO hard coded
                visibility: 0 // 0 = private;
            },
            {
                headers: { "Authorization": `Bearer ${accessToken}` }
            }
        )

        const uploadId = data.files[0].upload_id

        // step 2
        const { data: dataStep2 } = await axios.post(
            `${apiEndpoint}/file?upload_id=${uploadId}`,
            blob,
            {
                headers: { "Authorization": `Bearer ${accessToken}` }
            }
        )

        console.log( dataStep2 )
    }

    setGizmoMode = mode => this.transformControls.setMode( mode )

    setSelectedType = selectedType => this.setState({ selectedType })

    setCurrentAttachPoint = currentAttachPoint => this.setState({ currentAttachPoint })

    renderScene = () => {
        this.renderer.render( this.scene, this.camera )
    }

    render() {
        const { selectedType } = this.state

        return <>

            <canvas
                className = "canvas"
                ref = { el => this.canvas = el }
            />

            <GizmoModes setMode = { this.setGizmoMode } />

            {selectedType && (
                <ObjectLoader
                    selectedType = { selectedType }
                    setCurrentAttachPoint = { this.setCurrentAttachPoint }
                    onFileLoaded = { this.handleFileUpload }
                />
            )}

            <SideView
                setSelectedType = { this.setSelectedType }
                selectedType = { selectedType }
            />

        </>
    }
}

export default ThreeApp