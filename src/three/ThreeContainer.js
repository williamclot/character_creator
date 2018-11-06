import React from 'react';


import THREE from './threejs-service';

import promisifyLoader from '../utils/promisifyLoader';
import { defaultMeshes, meshStaticInfo, childrenList } from './meshInfo';
import { initCamera, initRenderer, initControls, initLights, initFloor, initGridHelper  } from './init';

const selectedColor = { r: 0.555, g: 0.48, b: 0.49 };

class ThreeContainer extends React.PureComponent {
    componentDidMount() {
        this.selected = "Head";
        this.group = new THREE.Group(); //this group will contain all the meshes but not the floor, the lights etc...
        // var bBoxStand;
        window.loaded = false;
        window.partloaded = false;

        //This keeps track of every mesh on the viewport
        this.loadedMeshes = defaultMeshes;


        this.scene = new THREE.Scene();
        this.loader = promisifyLoader( new THREE.GLTFLoader() );
        // fogColor = new THREE.Color(0xffffff);

        this.scene.background = new THREE.Color(0xeeeeee);
        this.scene.fog = new THREE.Fog(0xeeeeee, 1, 20);

        this.scene.add(this.group);

        this.camera = initCamera();
        this.renderer = initRenderer(this.canvas);
        this.controls = initControls(this.camera, this.canvas);

        const lights = initLights();
        const floor = initFloor();
        const gridHelper = initGridHelper();

        this.scene.add(...lights, floor, gridHelper);

        const animate = () => {
            if (process.env.NODE_ENV === 'production') {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => requestAnimationFrame(animate), 300);
            }
            this.controls.update();
            this.camera.lookAt(new THREE.Vector3(0, 1, 0));
            this.renderer.render(this.scene, this.camera);
        }
        animate();
        
        this.initWindowFunctions();
    }

    render() {
        return (
            <canvas
                ref={el => this.canvas = el}
            />
        );
    }

   
    // util functions below...    
    clearPosition(item) {
        // This function is used to clear the position of an imported gltf file
        item.position.set(0, 0, 0);
    }
    rotateElement(item, clearRotation, rotation) {
        if (clearRotation === true) {
            item.rotation.set(0,0,0);
        } else {
            const { x, y, z } = rotation;
            item.rotation.set(x, y, z);
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
        try {
            let gltf;
            if (options.shouldParse) {
                gltf = await this.loader.parse(options.data);
            } else {
                gltf = await this.loader.load(url);
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
            this.loadedMeshes[MeshType].name = meshName;
            this.loadedMeshes[MeshType].rotation = rotation;
    
            if (MeshType === "Head" && firstLoad) {
                this.changeColor("Head", selectedColor);
            }
    
            if (highLight) {
                this.changeColor(MeshType, selectedColor);
            }
    
            // Putting the new mesh in the pose configuration if any pose as been selected
            if (poseData) {
                root.traverse(function(child) {
                    if (child instanceof THREE.Bone) {
                        if (poseData[child.name]) {
                            window.changeRotation(child.name, poseData[child.name].x, "x");
                            window.changeRotation(child.name, poseData[child.name].y, "y");
                            window.changeRotation(child.name, poseData[child.name].z, "z");
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
                this.clearPosition(object);
                this.rotateElement(object, true);
                this.rotateElement(object, false, rotation);
                targetBone.add(object);
            }
    
            //Going to look for all children of current mesh
            let children = childrenList[MeshType];
            if (children) {
                for (let i = 0; i < children.length; i++) {
                    const childMesh = children[i];
    
                    const bodyPartClass = meshStaticInfo[childMesh].bodyPart;
                    const meshName = this.loadedMeshes[childMesh].name;
                    const url = process.env.PUBLIC_URL + "/models/" + bodyPartClass + "/" + meshName + ".glb";
    
                    this.group.remove(this.group.getObjectByName(childMesh));
    
                    this.placeMesh(
                        url,
                        {
                            meshName: this.loadedMeshes[childMesh].name,
                            MeshType: childMesh,
                            parentAttachment: meshStaticInfo[childMesh].parentAttachment,
                            childAttachment: meshStaticInfo[childMesh].childAttachment,
                            rotation: this.loadedMeshes[childMesh].rotation,
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
        } catch (err) {
            console.error(err);
        }
    }
    
    async placeStand() {
        // var topStand;
        var minFinder = new THREE.FindMinGeometry();
    
        if (this.scene.getObjectByName("mesh-stand")) {
            var resultR = minFinder.parse(this.scene.getObjectByName("FootR"));
            var resultL = minFinder.parse(this.scene.getObjectByName("FootL"));
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
        
                var resultR = minFinder.parse(this.scene.getObjectByName("FootR"));
                var resultL = minFinder.parse(this.scene.getObjectByName("FootL"));
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
            var minFinder = new THREE.FindMinGeometry();
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
            
                    var resultR = minFinder.parse(this.scene.getObjectByName("FootR"));
                    var resultL = minFinder.parse(this.scene.getObjectByName("FootL"));
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
            const meshName = this.loadedMeshes["Torso"].name;
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
        
            this.changeColor(this.selected, normal);
            this.changeColor(MeshType, selectedColor);
        
            this.selected = MeshType;
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
            var exporter = new THREE.STLExporter();
        
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
