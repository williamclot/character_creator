import React from 'react';
import axios from 'axios';

import * as THREE from 'three';
import STLExporter from 'three-stlexporter';
import TransformControls from 'three-transformcontrols';

import ls from './util/localStorageUtils';

import GroupManager from './loadedObjectsManager';

import { loadMeshFromURL, parseMesh } from './util/gltfLoader';
import { findMinGeometry } from './loadedObjectsManager/FindMinGeometry';
import { defaultMeshes, meshStaticInfo, childrenList, boneAttachmentRelationships } from './util/meshInfo';
import { initCamera, initRenderer, initControls, initLights, initFloor, initGridHelper, initScene } from './util/init';
import { clearPosition, rotateElement, clearRotation, __getStructure, __validateStructure } from './util/helpers';

import { lib as LIB, stand as STAND } from './tmp-lib';


const selectedColor = { r: 0.555, g: 0.48, b: 0.49 };

class ThreeContainer extends React.PureComponent {

    constructor() {
        super();

        if (!ls.isSelectedMeshSet) {
            ls.selectedMesh = "Head";
        }

        if (!ls.isLoadedMeshesSet) {
            ls.loadedMeshes = defaultMeshes;
        }
    }

    async componentDidMount() {

        window.loaded = false;
        window.partloaded = false;


        /** This will contain the group and everything else */
        this.scene = initScene();
    
        /** This group will contain all the meshes but not the floor, the lights etc... */
        this.group = new THREE.Group();
        this.groupManager = new GroupManager( this.group );
        
        const lights = initLights();
        const floor = initFloor();
        const gridHelper = initGridHelper();
        

        if (process.env.NODE_ENV === "development") {
            // expose variable to window in order to be able to use Three.js inspector
            window.scene = this.scene;
        }

        this.camera = initCamera();
        this.renderer = initRenderer(this.canvas);
        this.orbitControls = initControls(this.camera, this.canvas);
        this.transformControls = new TransformControls(this.camera, this.canvas);
        
        this.scene.add(this.group, this.transformControls, floor, gridHelper, ...lights);

        this.animate();

        // const { data: poseData } = await axios.get( process.env.PUBLIC_URL + '/models/poses/default.json' );
        
        // this.loadMeshesFirstTime(TMP_LIB, poseData);

        // this.canvas.addEventListener('click', this._onMouseClick );

        this.initWindowFunctions();
        window.loadDefaultMeshes();
    }

    render() {
        return (
            <canvas
                ref={el => this.canvas = el}
            />
        );
    }

    animate = () => {
        requestAnimationFrame(this.animate);

        this.orbitControls.update();

        // TODO function calls below may not be needed !!!
        this.camera.lookAt(new THREE.Vector3(0, 1, 0));
        this.renderer.render(this.scene, this.camera);
    }

    _onMouseClick = ev => {

        ev.preventDefault();

        const mouse = new THREE.Vector2;

        // get mouse coordinates: https://github.com/mrdoob/three.js/blob/dev/examples/js/controls/TransformControls.js#L502
        const { left, top, width, height } = this.canvas.getBoundingClientRect();

        mouse.x = ( ev.clientX - left ) / width * 2 - 1;
        mouse.y = - ( ev.clientY - top ) / height * 2 + 1;

        const raycaster = new THREE.Raycaster;

        raycaster.setFromCamera( mouse, this.camera );

        const intersects = raycaster.intersectObjects( this.group.children );

        if ( intersects.length > 0 ) {
            const obj = intersects[ 0 ].object;
            // if ( this.transformControls.object !== obj ) {
            //     this.transformControls.attach(obj);
            // }
        }
    }
        }

    async loadObject( url ) {
        const gltf = await loadMeshFromURL( url );
        return gltf.scene.children[0];
    }


    async loadMeshesFirstTime(standURL, lib, poseData) {
        console.log( 'loading first time ...' );

        const stand = await this.loadObject( standURL );
        
        this.placeStand( stand );

        const promises = lib.map( obj => this.loadObject( obj.url ));

        const objects = await Promise.all(promises);

        for (let [ index, obj ] of objects.entries()) {
            const categoryName = lib[ index ].type;

            this.placeSingleMesh(categoryName, obj, { poseData });
        }
    }

    

    placeSingleMesh(categoryName, root, options = {}) {
        const {
            rotation,
            position,
            scale,
            poseData
        } = options;

        root.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.material.color = { r: 0.5, g: 0.5, b: 0.5 };
            }
        });

        if (poseData) {
            root.traverse(child => {
                if (child instanceof THREE.Bone) {
                    const rotation = poseData[child.name];
                    if (rotation) {
                        const { x, y, z } = rotation;
                        child.rotation.set(x, y, z);
                    }
                }
            });
        }

        this.groupManager.add( categoryName, root );

    }

    /**
     * @param { THREE.Object3D } stand 
     */
    placeStand( stand ) {
        this.groupManager.placeStand( stand );
    }

    /**
     * main function used to load a mesh
     * @param {string} url 
     * @param {string} meshName 
     * @param {string} MeshType 
     * @param {*} parentAttachment 
     * @param {*} childAttachment 
     * @param {*} rotation 
     * @param {boolean} firstLoad 
     * @param {boolean} highLight 
     * @param {*} bones // not used
     * @param {*} poseData 
     */
    async placeMesh(
        url,
        options
    ) {
        // bodyPartClass : {arm, head, hand, torso, leg, foot}
        // MeshType : {ArmR, ArmL, Head, HandR, HandL, LegR, LegL, FootR, FootL, Torso}
        let gltf;
        try {
            if (options.shouldParse) {
                gltf = await this.loader.parse(options.data);
            } else {
                gltf = await this.loader.load(url);
            }
        } catch (err) {
            console.error(err);
            return;
        }
        
        const {
            meshName,
            MeshType,
            parentAttachment,
            childAttachment,
            rotation,
            firstLoad,
            highLight,
            // bones,
            poseData
        } = options;

        var root = gltf.scene.children[0];
        root.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                // Gives a fixed name to the mesh and same gray color
                child.name = "mesh-"+MeshType.toLowerCase();
                child.castShadow = true;
                child.material.color = { r: 0.5, g: 0.5, b: 0.5 };
            }
        });

        // group is one element with all the meshes and bones of the character
        this.group.add(root);
        this.scene.updateMatrixWorld(true);

        // Updates the loadedMeshes variable (used for replacing children)

        lsWrapper.setSingleLoadedMesh(
            MeshType,
            {
                name: meshName,
                rotation
            }
        );

        if (MeshType === "Head" && firstLoad) {
            this.changeColor("Head", selectedColor);
        }

        if (highLight) {
            this.changeColor(MeshType, selectedColor);
        }

        // Putting the new mesh in the pose configuration if any pose as been selected
        if (poseData) {
            root.traverse(child => {
                if (child instanceof THREE.Bone) {
                    const rotation = poseData[child.name];
                    if (rotation) {
                        const { x, y, z } = rotation;
                        child.rotation.set(x, y, z);
                    }
                }
            });
        }

        if (
            typeof parentAttachment !== "undefined" &&
            typeof childAttachment !== "undefined"
        ) {
            let targetBone = this.scene.getObjectByName(parentAttachment);
            let object = this.scene.getObjectByName(childAttachment);
            clearPosition(object);
            clearRotation(object);
            rotateElement(object, rotation);
            targetBone.add(object);
        }

        //Going to look for all children of current mesh
        let children = childrenList[MeshType];
        if (children) {
            for (let i = 0; i < children.length; i++) {
                const childMesh = children[i];

                const loadedChildMesh = lsWrapper.loadedMeshes[childMesh];
                const bodyPartClass = meshStaticInfo[childMesh].bodyPart;

                const meshName = loadedChildMesh.name;
                const url = process.env.PUBLIC_URL + "/models/" + bodyPartClass + "/" + meshName + ".glb";

                this.group.remove(this.group.getObjectByName(childMesh));

                this.placeMesh(
                    url,
                    {
                        meshName,
                        MeshType: childMesh,
                        parentAttachment: meshStaticInfo[childMesh].parentAttachment,
                        childAttachment: meshStaticInfo[childMesh].childAttachment,
                        rotation: loadedChildMesh.rotation,
                        firstLoad,
                        highLight: false,
                        poseData
                    }
                );
            }
        }

        if (MeshType === "FootR") {
            if (this.scene.getObjectByName("FootL_Toes_L")) {
                this.scene.updateMatrixWorld();
                this.placeStand();
            }
        } else if (MeshType === "FootL") {
            if (this.scene.getObjectByName("FootR_Toes_R")) {
                this.scene.updateMatrixWorld();
                this.placeStand();
            }
        }
        window.partloaded = true;
    }
    
    async __old__placeStand() {
        // var topStand;
    
        if (this.scene.getObjectByName("mesh-stand")) {
            var resultR = findMinGeometry(this.scene.getObjectByName("FootR"));
            var resultL = findMinGeometry(this.scene.getObjectByName("FootL"));
            var result = resultL > resultR ? resultR : resultL;
            // console.log(result);
        
            // bBoxStand = new THREE.Box3().setFromObject(root);
            // topStand = bBoxStand.max.y;
            this.scene.getObjectByName("Torso_Hip").position.y -= result;
        } else {
            const gltf = await this.loader.load(process.env.PUBLIC_URL + "/models/stand/circle.glb");
            try {
                var root = gltf.scene.children[0];
        
                root.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                        child.name = "mesh-stand"
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }
                });
        
                var resultR = findMinGeometry(this.scene.getObjectByName("FootR"));
                var resultL = findMinGeometry(this.scene.getObjectByName("FootL"));
                var result = resultL > resultR ? resultR : resultL;
        
                //Default color to all the meshes
                if (root.material) {
                    root.material.color = { r: 0.5, g: 0.5, b: 0.5 };
                }
        
                this.group.add(root);
                this.scene.getObjectByName("Torso_Hip").position.y -= result;
                window.loaded = true;
            } catch (err) {
                console.error(err);
            }
        }
    }

    changeColor(item, chosenColor) {
        var mesh = item === "pose" ? this.group : this.scene.getObjectByName(item);
        mesh.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                if (child.material) {
                    child.material.color = chosenColor;
                }
            }
        });
    }
    
    initWindowFunctions() {
        var link = document.createElement("a");
        link.style.display = "none";
        document.body.appendChild(link); // Firefox workaround, see #6594

        function save(blob, filename) {
            link.href = URL.createObjectURL(blob);
            link.download = filename || "data.json";
            link.click();
        }
        function saveArrayBuffer(buffer, filename) {
            save(new Blob([buffer], { type: "application/octet-stream" }), filename);
        }
        function saveString(text, filename) {
            save(new Blob([text], { type: "text/plain" }), filename);
        }

        window.changeStand = async function(stand) {
            if (this.scene.getObjectByName("mesh-stand")) {
                this.group.remove(this.scene.getObjectByName("mesh-stand"));
                const gltf = await this.loader.load(process.env.PUBLIC_URL + "/models/stand/"+stand+".glb");
                try {
                    var root = gltf.scene.children[0];
            
                    root.traverse(function(child) {
                        if (child instanceof THREE.Mesh) {
                            child.name = "mesh-stand"
                            child.castShadow = true;
                            child.receiveShadow = true;
                            child.material.color = { r: 0.555, g: 0.48, b: 0.49 };
                        }
                    });
            
                    var resultR = findMinGeometry(this.scene.getObjectByName("FootR"));
                    var resultL = findMinGeometry(this.scene.getObjectByName("FootL"));
                    var result = resultL > resultR ? resultR : resultL;
            
                    this.group.add(root);
                    this.scene.getObjectByName("Torso_Hip").position.y -= result;
                } catch (err) {
                    console.error(err);
                }
            }
        }.bind(this);
        window.loadDefaultMeshes = function(poseData) {
            this.loadMeshesFirstTime(TMP_LIB, poseData)
        }.bind(this);
        
        /**
         * @param meshURL - URL of resource to load
         * @param options - extra arguments
         */
        window.changeMesh = function(meshURL, options) {
            const { meshType, file, rotation, poseData, shouldParse, data } = options;

            window.partloaded = false;
        
            if (meshType) {
                let parentAttachment = meshStaticInfo[meshType].parentAttachment;
                let childAttachment = meshStaticInfo[meshType].childAttachment;
                let currentMesh = this.group.getObjectByName(meshType);
                let bonesToDelete =
                    meshType === "Torso"
                    ? this.scene.getObjectByName("Torso_Hip")
                    : this.group.getObjectByName(parentAttachment);
            
                if (currentMesh) {
                    this.group.remove(currentMesh);
                    if (bonesToDelete.children) {
                        for (let i = 0; i < bonesToDelete.children.length; i++) {
                            if (bonesToDelete.children[i] instanceof THREE.Bone) {
                                bonesToDelete.remove(bonesToDelete.children[i]);
                            }
                        }
                    }
                    
                    // if(!meshURL){
                    //   meshURL = "models/" + bodyPart + "/" + file + ".glb";
                    // }

                    this.placeMesh(
                        meshURL,
                        {
                            meshName: file,
                            MeshType: meshType,
                            parentAttachment,
                            childAttachment,
                            rotation,
                            firstLoad: false,
                            highLight: true,
                            poseData,
                            shouldParse,
                            data
                        }
                    );
                }
            }
            return true;
        }.bind(this);
        window.selectedMesh = function(MeshType) {
            // console.log(MeshType, selected);
            let normal = { r: 0.5, g: 0.5, b: 0.5 };
        
            this.changeColor(lsWrapper.selectedMesh, normal);
            this.changeColor(MeshType, selectedColor);
        
            lsWrapper.selectedMesh = MeshType;
        }.bind(this);

        window.changeRotation = function(bone_name, value, axis) {
            var bone = this.scene.getObjectByName(bone_name);
            if (bone instanceof THREE.Bone) {
                switch (axis) {
                    case "x":
                        bone.rotation.x = value;
                    break;
                    case "y":
                        bone.rotation.y = value;
                    break;
                    case "z":
                        bone.rotation.z = value;
                    break;
                    default:
                }
            }
        }.bind(this);
        window.getRotation = function(bone_name) {
            var bone = this.scene.getObjectByName(bone_name);
            if (bone instanceof THREE.Bone) {
                const { x, y, z } = bone.rotation; // TODO check if it doesn't break anything
                return { x, y, z };
            }
        }.bind(this);
        window.loadPose = function(poseData, bones) {
            var L,
            R = false;
            for (let i = 0; i < bones.length; i++) {
                let bone = bones[i].bone;
                window.changeRotation(bone, poseData[bone].x, "x");
                window.changeRotation(bone, poseData[bone].y, "y");
                window.changeRotation(bone, poseData[bone].z, "z");
            
                this.scene.updateMatrixWorld();
            
                if (bone === "LegL_Foot_L") {
                    L = true;
                    if (L && R) {
                        this.placeStand();
                    }
                }
                if (bone === "LegR_Foot_R") {
                    R = true;
                    if (L && R) {
                        this.placeStand();
                    }
                }
            }
        }.bind(this);
        window.export = function(name) {
            var exporter = new STLExporter();
        
            if (name) {
                saveString(exporter.parse(this.group), name + ".stl");
            } else {
                var stlList = []
                // I need to know in which order the files are exported...
                var Meshes = [
                    "mesh-stand",
                    "mesh-torso",
                    "mesh-arml",
                    "mesh-armr",
                    "mesh-footl",
                    "mesh-footr",
                    "mesh-handl",
                    "mesh-handr",
                    "mesh-head",
                    "mesh-legl",
                    "mesh-legr",
                    "mesh-neck"
                ];
                for (var i = 0; i < Meshes.length; i++) {
                    this.group.traverse(function (child) {
                        if (child.name === Meshes[i]) {
                            stlList.push(exporter.parse(child))
                        }
                    });
                }
                return stlList
            
                this.scene.traverse(function(child){
                    if (child instanceof THREE.Mesh){
                    console.log(child.name)
                    }
                })
            }
        }.bind(this);
        
        // onWindowResize() {
        //     camera.aspect = window.innerWidth / window.innerHeight;
        //     camera.updateProjectionMatrix();
        //     renderer.setSize(window.innerWidth, window.innerHeight);
        // }
    }
}

export default ThreeContainer;
