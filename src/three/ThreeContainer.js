import React from 'react';


import * as THREE from 'three';
import GLTFLoader from 'three-gltf-loader';
import STLExporter from 'three-stlexporter';

import { localStorageWrapper as lsWrapper } from '../utils/localStorageUtils';

import promisifyLoader from './util/promisifyLoader';
import { findMinGeometry } from './util/FindMinGeometry';
import { defaultMeshes, meshStaticInfo, childrenList, boneAttachmentRelationships } from './util/meshInfo';
import { initCamera, initRenderer, initControls, initLights, initFloor, initGridHelper, initScene } from './util/init';
import { clearPosition, rotateElement, clearRotation, __getStructure, __validateStructure } from './util/helpers';

const selectedColor = { r: 0.555, g: 0.48, b: 0.49 };


const __getBones = (mesh) => mesh.children.reduce((acc, child) => {
    if (!(child instanceof THREE.Bone)) {
        return acc;
    }
    const toAdd = __getBones(child) // empty object if children is empty array
    const isEmptyObject = Object.keys(toAdd).length !== 0;
    acc[child.name] = isEmptyObject ? toAdd : null;
    return acc;
}, {})

const __getMeshes = (mesh) => mesh.children.reduce((acc, child) => {
    if (!(child instanceof THREE.Mesh)) {
        return acc;
    }
    const toAdd = __getMeshes(child) // empty object if children is empty array
    const isEmptyObject = Object.keys(toAdd).length !== 0;
    acc[child.name] = isEmptyObject ? toAdd : null;
    return acc;
}, {})

if (process.env.NODE_ENV === "development") {
    // do this to force webpack not to shake off these functions
    // (if a variable is not used in the code, it will not be included in
    // the build and will therefore not be available when debugging)
    console.log(__getBones);
    console.log(__getMeshes);
}


class ThreeContainer extends React.PureComponent {
    initLoadedMeshes() {
        /** keeps track of the currently selected mesh */
        if (!lsWrapper.isSelectedMeshSet) {
            lsWrapper.selectedMesh = "Head";
        }

        /** This keeps track of every mesh on the viewport */
        if (!lsWrapper.isLoadedMeshesSet) {
            lsWrapper.loadedMeshes = defaultMeshes;            
        }
    }

    constructor() {
        super();

        this.loader = promisifyLoader( new GLTFLoader() );

        this.initLoadedMeshes();

        
        this.loadedAttachmentBones = {
            "ArmL_Hand_L"     : {},
            "ArmR_Hand_R"     : {},
            "LegL_Foot_L"     : {},
            "LegR_Foot_R"     : {},
            "Torso_Neck"      : {},
            "Torso_UpperArm_L": {},
            "Torso_UpperArm_R": {},
            "Torso_UpperLeg_L": {},
            "Torso_UpperLeg_R": {},
        };

        window.loaded = false;
        window.partloaded = false;


        /** This will contain the group and everything else */
        this.scene = initScene();
    
        /** This group will contain all the meshes but not the floor, the lights etc... */
        this.group = new THREE.Group();
        
        const lights = initLights();
        const floor = initFloor();
        const gridHelper = initGridHelper();
        
        this.scene.add(this.group, floor, gridHelper, ...lights);

        if (process.env.NODE_ENV === "development") {
            // expose variable to window in order to be able to use Three.js inspector
            window.scene = this.scene;
        }
    }

    animate = () => {
        if (process.env.NODE_ENV === 'production') {
            requestAnimationFrame(this.animate);
        } else {
            setTimeout(() => requestAnimationFrame(this.animate), 300);
        }
        this.controls.update();

        // TODO function calls below may not be needed !!!
        this.camera.lookAt(new THREE.Vector3(0, 1, 0));
        this.renderer.render(this.scene, this.camera);
    }

    componentDidMount() {
        this.camera = initCamera();
        this.renderer = initRenderer(this.canvas, 0.5);
        this.controls = initControls(this.camera, this.canvas);

        this.animate();
        
        this.loadMeshesFirstTime();

    }

    render() {
        return (
            <canvas
                ref={el => this.canvas = el}
            />
        );
    }

    loadMeshFromURL(url) {
        return this.loader.load(url);
    }

    parseMesh(data) {
        return this.loader.parse(data);
    }

    async loadMeshesFirstTime() {
        console.log( 'loading first time ...' );

        const lib = [
            {
                url: process.env.PUBLIC_URL + "/models/torso/blender.glb",
                type: "Torso"
            },
            {
                url: process.env.PUBLIC_URL + "/models/head/default_head.glb",
                type: "Head"
            },
            {
                url: process.env.PUBLIC_URL + "/models/arm/muscled_arm_L.glb",
                type: "ArmL"
            },
            {
                url: process.env.PUBLIC_URL + "/models/arm/muscled_arm_R.glb",
                type: "ArmR"
            },
            {
                url: process.env.PUBLIC_URL + "/models/hand/barbarian_L.glb",
                type: "HandL"
            },
            {
                url: process.env.PUBLIC_URL + "/models/hand/barbarian_R.glb",
                type: "HandR"
            },
            {
                url: process.env.PUBLIC_URL + "/models/leg/robot_leg_R.glb",
                type: "LegR"
            },
            {
                url: process.env.PUBLIC_URL + "/models/leg/robot_leg_L.glb",
                type: "LegL"
            },
            {
                url: process.env.PUBLIC_URL + "/models/foot/barbarian_L.glb",
                type: "FootL"
            },
            {
                url: process.env.PUBLIC_URL + "/models/foot/barbarian_R.glb",
                type: "FootR"
            },
        ];

        const promises = lib.map( obj => this.loadMeshFromURL(obj.url));

        // this.group.updateMatrixWorld();
        const gltfs = await Promise.all(promises);
        gltfs.forEach( ( gltf, index ) => {
            this.placeSingleMesh(gltf, { MeshType: lib[index].type });
        })

        // const newHead = await this.loadMeshFromURL(process.env.PUBLIC_URL + "/models/head/groot.glb");
        // this.placeSingleMesh(newHead);
    }

    

    placeSingleMesh(gltf, options = {}) {
        const {
            meshName,
            MeshType,
            parentAttachment,
            childAttachment,
            rotation,
            poseData
        } = options;

        const root = gltf.scene.children[0];

        root.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                child.castShadow = true;
                child.material.color = { r: 0.5, g: 0.5, b: 0.5 };
            }
        });

        function isParentAttachment(boneName) {
            return boneAttachmentRelationships.child[ boneName ] !== undefined;
        }
        function isChildAttachment(boneName) {
            return boneAttachmentRelationships.parent[ boneName ] !== undefined;
        }

        let anchor;
        root.traverse(element => {
            if ( element instanceof THREE.Bone ) {
                if ( isParentAttachment( element.name ) ) {

                    this.loadedAttachmentBones[ element.name ].parent = element;

                } else if ( isChildAttachment( element.name ) ) {

                    const parentName = boneAttachmentRelationships.parent[ element.name ];
                    anchor = this.loadedAttachmentBones[ parentName ];
                }
            }
        });


        if ( anchor ) {
            if ( anchor.child ) {
                anchor.parent.remove( anchor.child );
            }
            anchor.parent.add(root);
            anchor.child = root;
        } else {
            this.group.add(root);
        }
        

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
    
    async placeStand() {
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
        window.loadDefaultMeshes = function(bones, poseData) {
            const bodyPartClass = meshStaticInfo["Torso"].bodyPart;
            const meshName = lsWrapper.loadedMeshes["Torso"].name;
            const url = process.env.PUBLIC_URL + "/models/" + bodyPartClass + "/" + meshName + ".glb";

            this.placeMesh(
                url,
                {
                    meshName,
                    MeshType: "Torso",
                    parentAttachment: undefined,
                    childAttachment: undefined,
                    rotation: undefined,
                    firstLoad: true,
                    highLight: false,
                    poseData
                }
            );
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
