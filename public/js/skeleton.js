/**
 * MMF CUSTOMIZER
 * 
 * Based on https://github.com/mrdoob/three.js/
 * Tested on r95
 * @author williamclot / https://github.com/williamclot
 */

//Threejs important variables
var camera, scene, renderer;
var controls, loader;

var selected = "Head";
var color = {r:0.555,g:0.48,b:0.49};
var group = new THREE.Group();
var bBoxStand;

//This keeps track of every mesh on the viewport
var loadedMeshes = {
  Torso: {
    name: "turtle_torso",
    rotation: {x:0, y:0, z:0}
  },
  LegR: {
    name: "default_leg_R",
    rotation: {x: 0, y: 0, z: 0}
  },
  LegL: {
    name: "default_leg_L",
    rotation: {x: 0, y: 0, z: 0}
  },
  Head: {
    name: "default_head",
    rotation: {x: 0, y: 0, z: 0}
  },
  ArmR: {
    name: "default_arm_R",
    rotation: {x: 0, y: 0, z: 0}
  },
  ArmL: {
    name: "default_arm_L",
    rotation: {x: 0, y: 0, z: 0}
  },
  HandR: {
    name: "open_hand_R",
    rotation: {x: 0, y: -1.57, z: 0}
  },
  HandL: {
    name: "open_hand_L",
    rotation: {x: 0, y: 1.57, z: 0}
  },
  FootR: {
    name: "default_foot_R",
    rotation: {x: 0, y: 0, z: 0}
  },
  FootL: {
    name: "default_foot_L",
    rotation: {x: 0, y: 0, z: 0}
  }, 
  Stand: {
    name: "default",
    rotation: {x: 0, y: 0, z: 0}
  }
};

// List of information on the meshes (attach points, body groups...)
var meshStaticInfo = {
  Torso: {
    bodyPart: "torso",
    parentAttachment: undefined,
    childAttachment: undefined
  },
  Head: {
    bodyPart: "head",
    parentAttachment: "Torso_Neck",
    childAttachment: "Head_Neck"
  },
  ArmR: {
    bodyPart: "arm",
    parentAttachment: "Torso_UpperArm_R",
    childAttachment: "ArmR_UpperArm_R"
  },
  ArmL: {
    bodyPart: "arm",
    parentAttachment: "Torso_UpperArm_L",
    childAttachment: "ArmL_UpperArm_L"
  },
  HandR: {
    bodyPart: "hand",
    parentAttachment: "ArmR_Hand_R",
    childAttachment: "HandR_Hand_R"
  },
  HandL: {
    bodyPart: "hand",
    parentAttachment: "ArmL_Hand_L",
    childAttachment: "HandL_Hand_L"
  },
  LegR: {
    bodyPart: "leg",
    parentAttachment: "Torso_UpperLeg_R",
    childAttachment: "LegR_UpperLeg_R"
  },
  LegL: {
    bodyPart: "leg",
    parentAttachment: "Torso_UpperLeg_L",
    childAttachment: "LegL_UpperLeg_L"
  },
  FootR: {
    bodyPart: "foot",
    parentAttachment: "LegR_Foot_R",
    childAttachment: "FootR_Foot_R"
  },
  FootL: {
    bodyPart: "foot",
    parentAttachment: "LegL_Foot_L",
    childAttachment: "FootL_Foot_L"
  }
}

// List of parent/child relations
var childrenList = {
  ArmR: ["HandR"],
  ArmL: ["HandL"],
  Torso: ["ArmR","ArmL", "Head", "LegR", "LegL"],
  LegR: ["FootR"],
  LegL: ["FootL"]
}

init();
animate();

// Init Function which will create all the 
// Threejs environment and load the default meshes
function init() {
  "use strict";

  scene = new THREE.Scene();
  loader = new THREE.GLTFLoader();
  // fogColor = new THREE.Color(0xffffff);
 
  scene.background = new THREE.Color( 0xeeeeee );
  scene.fog = new THREE.Fog( 0xeeeeee, 1, 20 );

  
  scene.add(group);

  buildCamera();
  buildRenderer();
  buildControls();
  buildLights();
  buildFloor();

  function buildCamera() {
    camera = new THREE.PerspectiveCamera(
      75,
      (6 / 5) * (window.innerWidth / window.innerHeight),
      0.001,
      1000
    );

    // Camera position in space (will be controled by the OrbitControls later on)
    camera.position.z = 2;
    camera.position.x = -1;
    camera.position.y = 2;
  }
  function buildRenderer() {
    // Create a renderer with Antialiasing
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

    renderer.setSize((6 / 5) * window.innerWidth, window.innerHeight); // Configure renderer size
    // Append Renderer to DOM
    document.body.appendChild(renderer.domElement);

    var size = 50;
    var divisions = 50;

    var gridHelper = new THREE.GridHelper( size, divisions);
    scene.add( gridHelper );
  }
  function buildControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.target.set(-1,0,0);
    controls.minDistance = 2; //Controling max and min for ease of use
    controls.maxDistance = 7;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.enablePan = false;
  }
  function buildLights() {
    //hemisphere light
    var hemi = new THREE.HemisphereLight(0xffffff, 0xffffff);
    scene.add(hemi);

    //Create a PointLight and turn on shadows for the light
    var light = new THREE.PointLight(0xffffef, 1, 100);
    light.position.set(3, 10, 10);
    light.castShadow = true; 
    light.penumbra = 1;

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 2048; // default
    light.shadow.mapSize.height = 2048; // default
    light.shadow.camera.near = 1; // default
    light.shadow.camera.far = 30; // default
    // light.shadowDarkness = 0.5;
    light.decay = 1;

    scene.add(light);

  }
  function buildFloor() {
    //Create a plane that receives shadows (but does not cast them)
    var planeGeometry = new THREE.PlaneGeometry( 2000, 2000 );
    // planeGeometry.rotateX( - Math.PI / 2 );

    var planeMaterial = new THREE.ShadowMaterial();
    planeMaterial.opacity = 0.2;

    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = "plane";
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    plane.receiveShadow = true;
    scene.add(plane);
  }
}

function createReferenceSphere(pos) {
  //Create a plane that receives shadows (but does not cast them)
  var sphereGeometry = new THREE.SphereBufferGeometry(0.05, 0.05, 10);
  var sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xff1f00
  });
  var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.name = "sphere";
  sphere.position.x = pos.x;
  sphere.position.y = pos.y;
  sphere.position.z = pos.z;
  scene.add(sphere);
}

function clearPosition(item) {
  item.position.x = 0;
  item.position.y = 0;
  item.position.z = 0;
}
function rotateElement(item, clearRotation, rotation) {
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
function replaceMesh(MeshType, firstLoad, bones, poseData) {
  group.remove(group.getObjectByName(MeshType));
  placeMesh(
    loadedMeshes[MeshType].name,
    meshStaticInfo[MeshType].bodyPart,
    MeshType,
    meshStaticInfo[MeshType].parentAttachment,
    meshStaticInfo[MeshType].childAttachment,
    loadedMeshes[MeshType].rotation,
    firstLoad, 
    false,
    bones,
    poseData
  );
}
function placeMesh(
  meshName,
  bodyPartClass,
  MeshType,
  parentAttachment,
  childAttachment,
  rotation,
  firstLoad,
  highLight, 
  bones,
  poseData
) {
  // bodyPartClass : {arm, head, hand, torso, leg, foot}
  // MeshType : {ArmR, ArmL, Head, HandR, HandL, LegR, LegL, FootR, FootL, Torso}
  loader.load(
    "models/" + bodyPartClass + "/" + meshName + ".glb",
    gltf => {
      var root = gltf.scene.children[0];
      root.traverse( function(child){
        if (child instanceof THREE.Mesh){
          child.castShadow = true;
        }
      })
      // console.log("This is a category :", MeshType)
      group.add(root);

      scene.updateMatrixWorld(true);

      loadedMeshes[MeshType].name = meshName;
      loadedMeshes[MeshType].rotation = rotation;

      //Default color to all the meshes
      for (let i=0; i < root.children.length; i++){
        if (root.children[i].material){
          root.children[i].material.color = { r: 0.5, g: 0.5, b: 0.5 };
        }
      }

      if (MeshType === 'Head' && firstLoad){
        changeColor("Head",color)
      }

      if (highLight) {
        changeColor(MeshType, color);
      }

      // Putting the new mesh in the pose configuration if any pose as been selected
      if(poseData){
        root.traverse(function(child){
          if (child instanceof THREE.Bone){
            if (poseData[child.name]){
              window.changeRotation(child.name, poseData[child.name].x, "x")
              window.changeRotation(child.name, poseData[child.name].y, "y")
              window.changeRotation(child.name, poseData[child.name].z, "z")
            }
          }
        })
      }

      if(typeof parentAttachment !== "undefined" && typeof childAttachment !== "undefined"){
        let targetBone = scene.getObjectByName(parentAttachment);
        let object = scene.getObjectByName(childAttachment);
        clearPosition(object);
        rotateElement(object, true);
        rotateElement(object, false, rotation);
        targetBone.add(object);
      }

      //Going to look for all children of current mesh
      let children = childrenList[MeshType];
      if (children) {
        for (let i = 0; i < children.length; i++) {
          replaceMesh(children[i], firstLoad, bones, poseData);
        }
      }

      if (MeshType === "FootR"){
        if (scene.getObjectByName("FootL_Toes_L")){
          scene.updateMatrixWorld()
          placeStand()
        }
      }
      else if (MeshType === "FootL"){
        if (scene.getObjectByName("FootR_Toes_R")){
          scene.updateMatrixWorld()
          placeStand()
        }
      }
    },
    null,
    function ( error ) {
      console.log(error);
    }
  );
}

function placeStand(){
  // var topStand;
  var minFinder = new THREE.FindMinGeometry();

  if (scene.getObjectByName("Stand")){

    var resultR = minFinder.parse(scene.getObjectByName("FootR"))
    var resultL = minFinder.parse(scene.getObjectByName("FootL"))
    var result = (resultL > resultR) ? resultR : resultL;
    console.log(result);


    // bBoxStand = new THREE.Box3().setFromObject(root);
    // topStand = bBoxStand.max.y;
    scene.getObjectByName("Torso_Hip").position.y -= result;

    
  } else{
    loader.load(
      "models/stand/hexagone.glb",
      gltf => {
        var root = gltf.scene.children[0];

        root.traverse( function(child){
          if (child instanceof THREE.Mesh){
            child.castShadow = true;
            child.receiveShadow = true;
          }
        })
        
        var resultR = minFinder.parse(scene.getObjectByName("FootR"))
        var resultL = minFinder.parse(scene.getObjectByName("FootL"))
        var result = (resultL > resultR) ? resultR : resultL;
  
        //Default color to all the meshes
        if (root.material){
          root.material.color = { r: 0.4, g: 0.4, b: 0.4 };
        }

        group.add(root);
        scene.getObjectByName("Torso_Hip").position.y -= result;
      },
      null,
      function ( error ) {
        console.log(error);
      }
    );

  }
}

window.loadDefaultMeshes = function(loadedMeshes, bones, poseData) {
  placeMesh(
    loadedMeshes["Torso"].name,
    meshStaticInfo["Torso"].bodyPart,
    "Torso",
    undefined,
    undefined,
    undefined,
    true,
    false,
    bones,
    poseData
  );
}
window.changeMesh = function(bodyPart, part, isLeft, bones, poseData) {
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
      meshType = (isLeft) ? "HandL" : "HandR";
      file = (isLeft) ? part.file[0] : part.file[1];
      rotation = (isLeft) ? part.rotation[0] : part.rotation[1];
      break;
    case "arm":
      meshType = (isLeft) ? "ArmL" : "ArmR";
      file = (isLeft) ? part.file[0] : part.file[1];
      rotation = (isLeft) ? part.rotation[0] : part.rotation[1];
      break;
    case "foot":
      meshType = (isLeft) ?  "FootL" : "FootR";
      file = (isLeft) ? part.file[0] : part.file[1];
      rotation = (isLeft) ? part.rotation[0] : part.rotation[1];
      break;
    case "leg":
      meshType = (isLeft) ?  "LegL" : "LegR";
      file = (isLeft) ? part.file[0] : part.file[1];
      rotation = (isLeft) ? part.rotation[0] : part.rotation[1];
      break;
    default:
      meshType = undefined;
  }

  if (meshType) {
    let parentAttachment = meshStaticInfo[meshType].parentAttachment;
    let childAttachment = meshStaticInfo[meshType].childAttachment;
    let currentMesh = group.getObjectByName(meshType);
    let bonesToDelete = (meshType === "Torso") ? scene.getObjectByName("Torso_Hip") : group.getObjectByName(parentAttachment);

    if (currentMesh) {
      group.remove(currentMesh);
      if (bonesToDelete.children) {
        for (let i=0; i < bonesToDelete.children.length; i++) {
          if (bonesToDelete.children[i] instanceof THREE.Bone){
            bonesToDelete.remove(bonesToDelete.children[i]);
          }
        }
      }
    }
    placeMesh(
      file,
      bodyPart,
      meshType,
      parentAttachment,
      childAttachment,
      rotation,
      false,
      true,
      bones,
      poseData
    );
  }
}
window.selectedMesh = function (MeshType) {
  // console.log(MeshType);
  let normal = { r: 0.5, g: 0.5, b: 0.5 };

  changeColor(selected, normal);
  changeColor(MeshType, color); 
  

  selected = MeshType;
}
function changeColor(item, color){
  var mesh = (item === 'pose') ? group : scene.getObjectByName(item);
  mesh.traverse(function(child){
    if (child instanceof THREE.Mesh){
      if(child.material){
        child.material.color.r = color.r;
        child.material.color.g = color.g;
        child.material.color.b = color.b;
      }
    }
  });
}
window.changeRotation = function(bone_name, value, axis){
  var bone = scene.getObjectByName(bone_name);
  if (bone instanceof THREE.Bone){
    switch(axis){
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
}
window.getRotation = function(bone_name){
  var bone = scene.getObjectByName(bone_name);
  if (bone instanceof THREE.Bone){
    return ({x:bone.rotation.x, y:bone.rotation.y, z:bone.rotation.z})
  }
}

window.loadPose = function(poseData, bones){
  var L, R = false;
  for (let i=0; i<bones.length; i++){
    let bone = bones[i].bone;
    window.changeRotation(bone, poseData[bone].x, "x")
    window.changeRotation(bone, poseData[bone].y, "y")
    window.changeRotation(bone, poseData[bone].z, "z")

    scene.updateMatrixWorld();

    if (bone === "LegL_Foot_L"){
      L = true;
      if (L && R){
        placeStand();
      }
    }
    if (bone === "LegR_Foot_R"){
      R = true;
      if (L && R){
        placeStand();
      }
    }
  }
  
}
window.export = function(name) {
  var exporter = new THREE.STLExporter();
  saveString( exporter.parse( group ), name+'_export.stl' );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  render();
}
function render() {
  camera.lookAt(new THREE.Vector3(0, 1, 0));
  renderer.render(scene, camera);
}
document.body.onresize = function() {
  renderer.setSize((6 / 5) * window.innerWidth, window.innerHeight); //size of viewport
  camera.aspect = ((6 / 5) * window.innerWidth) / window.innerHeight; //aspect ratio update
  camera.updateProjectionMatrix();
  renderer.domElement.style.position = -(1 / 5) * window.innerWidth;
};

var link = document.createElement( 'a' );
link.style.display = 'none';
document.body.appendChild( link ); // Firefox workaround, see #6594

function save( blob, filename ) {
  link.href = URL.createObjectURL( blob );
  link.download = filename || 'data.json';
  link.click();
}
function saveArrayBuffer( buffer, filename ) {
  save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
}
function saveString( text, filename ) {
  save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}
