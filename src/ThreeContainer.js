import React from 'react';


import THREE from './threejs-service';

import { defaultMeshes, meshStaticInfo, childrenList } from './utils/meshInfo';

class ThreeContainer extends React.PureComponent {
    componentDidMount() {
        this.selected = "Head";
        this.color = { r: 0.555, g: 0.48, b: 0.49 };
        this.group = new THREE.Group(); //this group will contain all the meshes but not the floor, the lights etc...
        // var bBoxStand;
        window.loaded = false;
        window.partloaded = false;

        //This keeps track of every mesh on the viewport
        this.loadedMeshes = defaultMeshes;


        this.scene = new THREE.Scene();
        this.loader = new THREE.GLTFLoader();
        // fogColor = new THREE.Color(0xffffff);

        this.scene.background = new THREE.Color(0xeeeeee);
        this.scene.fog = new THREE.Fog(0xeeeeee, 1, 20);

        this.scene.add(this.group);

        this.buildCamera();
        this.buildRenderer();
        this.buildControls();
        this.buildLights();
        this.buildFloor();

        const render = () => {
            this.camera.lookAt(new THREE.Vector3(0, 1, 0));
            this.renderer.render(this.scene, this.camera);
        }
        const animate = () => {
            if (process.env.NODE_ENV === 'production') {
                requestAnimationFrame(animate);
            } else {
                setTimeout(() => requestAnimationFrame(animate), 300);
            }
            this.controls.update();
            render();
        }
        animate();
        
        this.initWindowFunctions();
    }

    render() {
        return <div id = "canvas" />;
    }

    // functions to initialize below...    
    buildCamera() {
        this.camera = new THREE.PerspectiveCamera(
            75,
            (6 / 5) * (window.innerWidth / window.innerHeight),
            0.001,
            1000
        );

        // Camera position in space (will be controled by the OrbitControls later on)
        this.camera.position.z = 2;
        this.camera.position.x = -1;
        this.camera.position.y = 2;

        // this.camera.position.set(2, -1, 2); // this should replace the above lines (but needs testing)
    }
    buildRenderer() {
        // Create a renderer with Antialiasing
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        var container = document.getElementById("canvas");
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

        this.renderer.setSize((6 / 5) * window.innerWidth, window.innerHeight); // Configure renderer size
        // Append Renderer to DOM
        container.appendChild(this.renderer.domElement);

        var size = 50;
        var divisions = 60;

        var gridHelper = new THREE.GridHelper(size, divisions);
        this.scene.add(gridHelper);
    }
    buildControls() {
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        // controls.target.set(-1,0,0);
        this.controls.minDistance = 2; //Controling max and min for ease of use
        this.controls.maxDistance = 7;
        this.controls.minPolarAngle = 0;
        this.controls.maxPolarAngle = Math.PI / 2 - 0.1;
        this.controls.enablePan = false;
    }
    buildLights() {
        //hemisphere light: like sun light but without any shadows
        var hemi = new THREE.HemisphereLight(0xffffff, 0xffffff);
        this.scene.add(hemi);

        //Create a PointLight and turn on shadows for the light
        var light = new THREE.PointLight(0xc1c1c1, 1, 100);
        light.position.set(3, 10, 10);
        light.castShadow = true;
        //Set up shadow properties for the light
        light.shadow.mapSize.width = 2048; // default
        light.shadow.mapSize.height = 2048; // default
        light.decay = 1;
        this.scene.add(light);

        // This light is here to show the details in the back (no shadows)
        var backlight = new THREE.PointLight(0xc4b0ac, 1, 100);
        backlight.position.set(0, 2, -20);
        backlight.penumbra = 2;
        this.scene.add(backlight);
    }
    buildFloor() {
        //Create a plane that receives shadows (but does not cast them)
        var planeGeometry = new THREE.PlaneGeometry(2000, 2000);
        // planeGeometry.rotateX( - Math.PI / 2 );

        var planeMaterial = new THREE.ShadowMaterial();
        planeMaterial.opacity = 0.2;

        var plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.name = "plane";
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = 0;
        plane.receiveShadow = true;
        this.scene.add(plane);
    }

    // util functions below...    
    clearPosition(item) {
        // This function is used to clear the position of an imported gltf file
        item.position.x = 0;
        item.position.y = 0;
        item.position.z = 0;
    }
    rotateElement(item, clearRotation, rotation) {
        if (clearRotation === true) {
        item.rotation.x = 0;
        item.rotation.y = 0;
        item.rotation.z = 0;
        } else {
        item.rotation.x = rotation.x;
        item.rotation.y = rotation.y;
        item.rotation.z = rotation.z;
        }
    }
    
    /**
     * main function used to load a mesh
     * @param {string} meshName 
     * @param {string} url 
     * @param {string} MeshType 
     * @param {*} parentAttachment 
     * @param {*} childAttachment 
     * @param {*} rotation 
     * @param {boolean} firstLoad 
     * @param {boolean} highLight 
     * @param {*} bones // not used
     * @param {*} poseData 
     */
    placeMesh(
        meshName,
        url,
        MeshType,
        parentAttachment,
        childAttachment,
        rotation,
        firstLoad,
        highLight,
        // bones,
        poseData
    ) {
        // bodyPartClass : {arm, head, hand, torso, leg, foot}
        // MeshType : {ArmR, ArmL, Head, HandR, HandL, LegR, LegL, FootR, FootL, Torso}
        this.loader.load(
            url,
            gltf => {
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
                    this.changeColor("Head", this.color);
                }
        
                if (highLight) {
                    this.changeColor(MeshType, this.color);
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
                        meshName,
                        url,
                        childMesh,
                        meshStaticInfo[childMesh].parentAttachment,
                        meshStaticInfo[childMesh].childAttachment,
                        this.loadedMeshes[childMesh].rotation,
                        firstLoad,
                        false,
                        // bones,
                        poseData
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
            },
            null,
            function(error) {
                console.log(error);
            }
        );
    }
    
    placeStand() {
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
            this.loader.load(
                process.env.PUBLIC_URL + "/models/stand/circle.glb",
                gltf => {
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
                },
                null,
                function(error) {
                    console.log(error);
                }
            );
        }
    }

    changeColor(item, choosenColor) {
        var mesh = item === "pose" ? this.group : this.scene.getObjectByName(item);
        mesh.traverse(function(child) {
            if (child instanceof THREE.Mesh) {
                if (child.material) {
                child.material.color.r = choosenColor.r;
                child.material.color.g = choosenColor.g;
                child.material.color.b = choosenColor.b;
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

        window.changeStand = function(stand) {
            var minFinder = new THREE.FindMinGeometry();
            if (this.scene.getObjectByName("mesh-stand")) {
                this.group.remove(this.scene.getObjectByName("mesh-stand"));
                this.loader.load(
                    process.env.PUBLIC_URL + "/models/stand/"+stand+".glb",
                    gltf => {
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
                    },
                    null,
                    function(error) {
                        console.log(error);
                    }
                );
            }
        }.bind(this);
        window.loadDefaultMeshes = function(bones, poseData) {
            const bodyPartClass = meshStaticInfo["Torso"].bodyPart;
            const meshName = this.loadedMeshes["Torso"].name;
            const url = process.env.PUBLIC_URL + "/models/" + bodyPartClass + "/" + meshName + ".glb";
            this.placeMesh(
                meshName,
                url,
                "Torso",
                undefined,
                undefined,
                undefined,
                true,
                false,
                // bones,
                poseData
            );
        }.bind(this);
        
        /**
         * @param bodyPart - name of meshType
         * @param part - json metadata: name, img, file, author, description, rotation, scale, link 
         * @param isLeft - to identify if left or right
         * @param poseData - data about the pose to render
         * @param meshURL - URL of resource to load
         */
        window.changeMesh = function(bodyPart, part, isLeft, poseData, meshURL) {
            window.partloaded = false;
            var meshType;
            var file;
            var rotation;
        
            switch (bodyPart) {
            case "torso":
                file = part.file;
                rotation = undefined;
                meshType = "Torso";
                break;
            case "head":
                file = part.file;
                rotation = part.rotation;
                meshType = "Head";
                break;
            case "hand":
                meshType = isLeft ? "HandL" : "HandR";
                file = part.file;
                rotation = part.rotation;
                break;
            case "arm":
                meshType = isLeft ? "ArmL" : "ArmR";
                file = part.file;
                rotation = part.rotation;
                break;
            case "foot":
                meshType = isLeft ? "FootL" : "FootR";
                file = part.file;
                rotation = part.rotation;
                break;
            case "leg":
                meshType = isLeft ? "LegL" : "LegR";
                file = part.file;
                rotation = part.rotation;
                break;
            default:
                meshType = undefined;
            }
        
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
                        file,
                        meshURL,
                        meshType,
                        parentAttachment,
                        childAttachment,
                        rotation,
                        false,
                        true,
                        // bones,
                        poseData
                    );
                }
            }
            return true;
        }.bind(this);
        window.selectedMesh = function(MeshType) {
            // console.log(MeshType, selected);
            let normal = { r: 0.5, g: 0.5, b: 0.5 };
        
            this.changeColor(this.selected, normal);
            this.changeColor(MeshType, this.color);
        
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
