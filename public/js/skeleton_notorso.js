//Threejs important variables
var camera, scene, renderer;
var controls, loader;

//This keeps track of every mesh on the viewport
var loadedMeshes = {
  Head: {
    name: undefined,
    rotation: undefined
  },
  ArmR: {
    name: undefined,
    rotation: undefined
  },
  ArmL: {
    name: undefined,
    rotation: undefined
  },
  HandR: {
    name: undefined,
    rotation: undefined
  },
  HandL: {
    name: undefined,
    rotation: undefined
  },
};

// List of information on the meshes (attach points, body groups...)
var meshStaticInfo = {
  Head: {
    bodyPart: "head",
    parentAttachment: "Armature_Neck",
    childAttachment: "Head_Neck"
  },
  ArmR: {
    bodyPart: "arm",
    parentAttachment: "Armature_UpperArm_R",
    childAttachment: "ArmR_UpperArm_R"
  },
  ArmL: {
    bodyPart: "arm",
    parentAttachment: "Armature_UpperArm_L",
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
  }
}

// List of parent/child relations
var childrenList = {
  ArmR: ["HandR"],
  ArmL: ["HandL"],
  Torso: ["ArmR","ArmL"],
  LegR: ["FootR"],
  LegL: ["FootL"]
}

init();
animate();

function init() {
  "use strict";

  scene = new THREE.Scene();
  loader = new THREE.GLTFLoader();

  buildCamera();
  buildRenderer();
  buildControls();
  buildLights();
  buildFloor();
  loadDefaultMeshes();

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
    renderer.setSize((6 / 5) * window.innerWidth, window.innerHeight); // Configure renderer size
    // Append Renderer to DOM
    document.body.appendChild(renderer.domElement);

    var path = "../img/library/textures/fantasy-";
    var format = ".jpg";
    var urls = [
      path + "px" + format,
      path + "nx" + format,
      path + "py" + format,
      path + "ny" + format,
      path + "pz" + format,
      path + "nz" + format
    ];

    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;
    scene.background = reflectionCube;
  }
  function buildControls() {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    // controls.target.set(-1,0,0);
    controls.minDistance = 2; //Controling max and min for ease of use
    controls.maxDistance = 15;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.enablePan = false;
  }
  function buildLights() {
    //hemisphere light
    var hemi = new THREE.HemisphereLight(0xffffff, 0xffffff);
    scene.add(hemi);

    //Create a PointLight and turn on shadows for the light
    var light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(0, 10, 10);
    scene.add(light);

    //Set up shadow properties for the light
    light.shadow.mapSize.width = 2048; // default
    light.shadow.mapSize.height = 2048; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
  }
  function buildFloor() {
    //Create a plane that receives shadows (but does not cast them)
    var color = new THREE.Color("rgb(213, 212, 218)");
    var planeGeometry = new THREE.PlaneBufferGeometry(10, 10, 1, 1);
    var planeMaterial = new THREE.MeshBasicMaterial({
      color: color
    });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.name = "plane";
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = 0;
    plane.receiveShadow = true;
    scene.add(plane);
  }
  function createReferenceSphere(pos) {
    //Create a plane that receives shadows (but does not cast them)
    var sphereGeometry = new THREE.SphereBufferGeometry(0.1, 0.1, 10);
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

  function placeMesh(
    meshName,
    bodyPartClass,
    MeshType,
    target,
    attachementPoint,
    rotation,
    replaceChildren
  ) {
    // bodyPartClass : {arm, head, hand}
    // MeshType : {ArmR, ArmL, Head, HandR, HandL}
    loader.load(
      "../models/" + bodyPartClass + "/" + meshName + ".glb",
      gltf => {
        var root = gltf.scene.children[0];
        root.castShadow = true;
        scene.add(root);

        //Default color to all the meshes
        for (let i=0; i < root.children.length; i++){
          if (root.children[i].material){
            root.children[i].material.color = { r: 0.5, g: 0.5, b: 0.5 };
          }
        }
        
        let targetBone = scene.getObjectByName(target);
        let object = root.getObjectByName(attachementPoint);

        clearPosition(object);
        rotateElement(object, true);
        rotateElement(object, false, rotation);

        targetBone.add(object);

        if (replaceChildren) {
          //Going to look for all children of current mesh
          let children = childrenList[MeshType];
          for (let i=0; i < children.length; i++){
            replaceMesh(children[i]);
          }
        }

        loadedMeshes[MeshType].name = meshName;
        loadedMeshes[MeshType].rotation = rotation;
      },
      null,
      null
    );
  }

  function loadDefaultMeshes() {
    // Load a glTF resource
    loader.load(
      "../models/rigged_man.glb",
      gltf => {
        var root = gltf.scene.children[0];
        root.castShadow = true;
        scene.add(root);

        scene.getObjectByName("Mesh_Head").visible = false;
        scene.getObjectByName("Mesh_Arm_R").visible = false;
        scene.getObjectByName("Mesh_Hand_R").visible = false;
        scene.getObjectByName("Mesh_Hand_L").visible = false;
        scene.getObjectByName("Mesh_Arm_L").visible = false;

        placeMesh(
          "thin_arm_R",
          "arm",
          "ArmR",
          "Armature_UpperArm_R",
          "ArmR_UpperArm_R",
          {
            x: 0,
            y: 3,
            z: 0
          }
        );
        placeMesh(
          "thin_arm_L",
          "arm",
          "ArmL",
          "Armature_UpperArm_L",
          "ArmL_UpperArm_L",
          {
            x: 0,
            y: -3,
            z: 0
          }
        );
        placeMesh(
          "open_Hand_L",
          "hand",
          "HandL",
          "ArmL_Hand_L",
          "HandL_Hand_L",
          {
            x: 0,
            y: Math.PI / 2,
            z: 0
          }
        );
        placeMesh(
          "stormtrooper",
          "head",
          "Head",
          "Armature_Neck",
          "Head_Neck",
          {
            y: Math.PI,
            x: 0,
            z: 0
          }
        );
        placeMesh(
          "open_Hand_R",
          "hand",
          "HandR",
          "ArmR_Hand_R",
          "HandR_Hand_R",
          {
            x: 0,
            y: -Math.PI / 2,
            z: 0
          }
        );
      },
      null,
      null
    );
  }

  function replaceMesh(MeshType) {
    scene.remove(scene.getObjectByName(MeshType));
    placeMesh(
      loadedMeshes[MeshType].name,
      meshStaticInfo[MeshType].bodyPart,
      MeshType,
      meshStaticInfo[MeshType].parentAttachment,
      meshStaticInfo[MeshType].childAttachment,
      loadedMeshes[MeshType].rotation,
      false
    );
  }

  // window.selectedMesh = function(item, bool) {
  //   let highLight = {r:0.1,g:0.4,b:0.3};
  //   let normal = {r:0.5, g: 0.5, b:0.5};

  //   let rootItem = scene.getObjectByName(item);

  //   if (rootItem.children[0].material) {
  //     if (bool){
  //       rootItem.children[0].material.color = highLight;
  //     } else {
  //       rootItem.children[0].material.color = normal;
  //     }
  //   }
  // }

  window.changeMesh = function(bodyPart, part, isLeft) {
    if (bodyPart === "head") {
      let parentAttachment = meshStaticInfo["Head"].parentAttachment;
      let childAttachment = meshStaticInfo["Head"].childAttachment;
      let currentMesh = scene.getObjectByName("Head");
      if (currentMesh) {
        // There is already head
        const bonesToDelete = scene.getObjectByName(parentAttachment);
        scene.remove(currentMesh);
        bonesToDelete.remove(bonesToDelete.children[1]);
      }
      placeMesh(
        part.file,
        bodyPart,
        "Head",
        parentAttachment,
        childAttachment,
        part.rotation
      );
    } else if (bodyPart === "hand") {
      if (isLeft) {
        let currentMesh = scene.getObjectByName("HandL");
        if (currentMesh) {
          // There is already head
          const bonesToDelete = scene.getObjectByName("ArmL_Hand_L");
          scene.remove(currentMesh);
          bonesToDelete.remove(bonesToDelete.children[1]);
        }
        placeMesh(
          part.file[0],
          bodyPart,
          "HandL",
          "ArmL_Hand_L",
          "HandL_Hand_L",
          part.rotation[0]
        );
      } else {
        let currentMesh = scene.getObjectByName("HandR");
        if (currentMesh) {
          // There is already head
          const bonesToDelete = scene.getObjectByName("ArmR_Hand_R");
          scene.remove(currentMesh);
          bonesToDelete.remove(bonesToDelete.children[1]);
        }
        placeMesh(
          part.file[1],
          bodyPart,
          "HandR",
          "ArmR_Hand_R",
          "HandR_Hand_R",
          part.rotation[1]
        );
      }
    } else if (bodyPart === "arm") {
      if (isLeft) {
        let currentMesh = scene.getObjectByName("ArmL");
        if (currentMesh) {
          // There is already head
          const bonesToDelete = scene.getObjectByName("Armature_UpperArm_L");
          scene.remove(currentMesh);
          bonesToDelete.remove(bonesToDelete.children[1]);
        }
        placeMesh(
          part.file[0],
          bodyPart,
          "ArmL",
          "Armature_UpperArm_L",
          "ArmL_UpperArm_L",
          part.rotation[0],
          true
        );
      } else {
        let currentMesh = scene.getObjectByName("ArmR");
        if (currentMesh) {
          // There is already head
          const bonesToDelete = scene.getObjectByName("Armature_UpperArm_R");
          scene.remove(currentMesh);
          bonesToDelete.remove(bonesToDelete.children[1]);
        }
        placeMesh(
          part.file[1],
          bodyPart,
          "ArmR",
          "Armature_UpperArm_R",
          "ArmR_UpperArm_R",
          part.rotation[1],
          true
        );
      }
    }
  };

  window.dab = function() {
    scene.getObjectByName("Armature_Neck").rotation.z = 0.5;
    scene.getObjectByName("Armature_Neck").rotation.x = 0.5;

    scene.getObjectByName("Armature_Spine").rotation.x = 0.2;
    scene.getObjectByName("Armature_Spine").rotation.x = 0.2;

    scene.getObjectByName("ArmL_UpperArm_L").rotation.z = -2;
    scene.getObjectByName("ArmL_UpperArm_L").position.x += 0.1;
    scene.getObjectByName("ArmL_LowerArm_L").rotation.x = 3;

    scene.getObjectByName("ArmR_UpperArm_R").rotation.z = 0.4;
    scene.getObjectByName("ArmR_LowerArm_R").rotation.x = 0.5;
  };
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
