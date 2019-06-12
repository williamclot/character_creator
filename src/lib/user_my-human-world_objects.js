const lib = {
    "byPartTypeId": {
        95: [ // Torso
            {
                "id": 1,
                "name": "Cylinder",
                "download_url": process.env.PUBLIC_URL + "/models/cylinder.stl",
                "extension": "stl",
                "metadata": {
                    "scale": 3,
                    "attachPoints": {
                        "Torso_Neck": {
                            "x": -0.008884304243588645,
                            "y": 1.9614155888557434,
                            "z": 0.09450079013285406
                        },
                        "Torso_UpperArm_L": {
                            "x": 0.1,
                            "y": 1.9614155888557434,
                            "z": 0
                        },
                        "Torso_UpperArm_R": {
                            "x": -0.1,
                            "y": 1.9614155888557434,
                            "z": 0
                        },
                        "Torso_UpperLeg_L": {
                            "x": 0.2907995785808455,
                            "y": -1.9614155888557434,
                            "z": 0.022966212705601174
                        },
                        "Torso_UpperLeg_R": {
                            "x": -0.3229941152623676,
                            "y": -1.9614155888557434,
                            "z": -0.07123728410431474
                        }
                    }
                }
            },
            {
                "id": 2,
                "name": "CUBE TORSO",
                "download_url": process.env.PUBLIC_URL + "/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "attachPoints": {
                        "Torso_Neck": {
                            "x": -0.004552757158817977,
                            "y": 0.5,
                            "z": -0.04862498299947271
                        },
                        "Torso_UpperArm_R": {
                            "x": -0.5,
                            "y": 0.05934291105191403,
                            "z": 0.033437911132452314
                        },
                        "Torso_UpperArm_L": {
                            "x": 0.5,
                            "y": 0.10856463702668284,
                            "z": 0.07631037319471545
                        },
                        "Torso_UpperLeg_R": {
                            "x": -0.27564668472500375,
                            "y": -0.5,
                            "z": 0.09211377758511352
                        },
                        "Torso_UpperLeg_L": {
                            "x": 0.2569476047538435,
                            "y": -0.5,
                            "z": 0.018594168965584856
                        }
                    }
                }
            },
        ],
        96: [ // Head
            {
                "id": 3,
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "scale": .4
                }
            },  
        ],
        98: [ // ArmR
            {
                "id": 4,
                "name": "Cylinder",
                "download_url": process.env.PUBLIC_URL + "/models/cylinder.stl",
                "extension": "stl",
                "metadata": {
                    
                    
                    "position": {
                        "x": -0.004535016565342026,
                        "y":  0.5141420841591644,
                        "z": -0.0021842929044645354,
                    },
                    "rotation": {
                        "x": 0,
                        "y": 0,
                        "z": 1.9198621771937625
                    },
                    "scale": 0.764753787276196,
                    
                    "attachPoints": {
                        "ArmR_Hand_R":{
                            "x": -0.8369515528225573,
                            "y": -0.3120135173281886,
                            "z": -0.0040737141462420905
                        }
                    }
                }
            },
            {
                "id": 5,
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "attachPoints": {
                        "ArmR_Hand_R": {
                            "x": -0.5,
                            "y": 0.05934291105191403,
                            "z": 0.033437911132452314
                        },
                    }
                }
            },
        ],
        97: [ // ArmL
            {
                "id": 6,
                "name": "Cylinder",
                "download_url": process.env.PUBLIC_URL + "/models/cylinder.stl",
                "extension": "stl",
                "metadata": {
                    
                    
                    "position": {
                        "x": -0.004535016565342026,
                        "y":  0.5141420841591644,
                        "z": -0.0021842929044645354,
                    },
                    "rotation": {
                        "x":  0,
                        "y":  0,
                        "z": -1.9198621771937625
                    },
                    "scale": 0.764753787276196,
                    
                    "attachPoints": {
                        "ArmL_Hand_L":{
                            "x": 0.8369515528225573,
                            "y": -0.3120135173281886,
                            "z": -0.0040737141462420905
                        }
                    }
                }
            },
            {
                "id": 7,
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "attachPoints": {
                        "ArmL_Hand_L": {
                            "x": 0.5,
                            "y": 0.10856463702668284,
                            "z": 0.07631037319471545
                        },
                    }
                }
            },
        ],
        100: [ // HandR
            {
                "id": 8,
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "scale": .4
                }
            },  
        ],
        99: [ // HandL
            {
                "id": 9,
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "scale": .4
                }
            },  
        ],
        102: [ // LegR
            {
                "id": 10,
                "name": "Cylinder",
                "download_url": process.env.PUBLIC_URL + "/models/cylinder.stl",
                "extension": "stl",
                "metadata": {
                    "position": {
                        "x": 0.0011903476352935934,
                        "y": -0.4738051962852478,
                        "z": -0.015501220110232248,
                    },
                    "rotation": {
                        "x": 0,
                        "y": 0,
                        "z": -0.5235987755982988,
                    },
                    "scale": 0.764753787276196,
                    "attachPoints": {
                        "LegR_Foot_R": {
                            "x": -0.43,
                            "y": -0.74,
                            "z": 0.004
                        },
                    }
                }
            },
            {
                "id": 11,
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "attachPoints": {
                        "LegR_Foot_R": {
                            "x": -0.27564668472500375,
                            "y": -0.5,
                            "z": 0.09211377758511352
                        },
                    }
                }
            },
        ],
        101: [ // LegL
            {
                "id": 12,
                "name": "Cylinder",
                "download_url": process.env.PUBLIC_URL + "/models/cylinder.stl",
                "extension": "stl",
                "metadata": {
                    "position": {
                        "x": 0.0011903476352935934,
                        "y": -0.4738051962852478,
                        "z": -0.015501220110232248,
                    },
                    "rotation": {
                        "x": 0,
                        "y": 0,
                        "z": 0.5235987755982988,
                    },
                    "scale": 0.764753787276196,
                    "attachPoints": {
                        "LegL_Foot_L": {
                            "x": 0.43,
                            "y": -0.74,
                            "z": 0.004
                        },
                    }
                }
            },
            {
                "id": 13,
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "attachPoints": {
                        "LegL_Foot_L": {
                            "x": 0.2569476047538435,
                            "y": -0.5,
                            "z": 0.018594168965584856
                        },
                    }
                }
            },
        ],
        104: [ // FootR
            {
                "id": 14,
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "scale": .4
                }
            },  
        ],
        103: [ // FootL
            {
                "id": 15,
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "scale": .4
                }
            },  
        ]
    },
    "allPartTypeIds": [
        95,
        96,
        98,
        97,
        100,
        99,
        102,
        101,
        104,
        103
    ],
    "poses": [
        // "/models/pose-dab.json",
        // "/models/pose-default.json",
        // "/models/pose-egypt.json",
        // "/models/pose-gedan_barai.json",
        // "/models/pose-king_kong.json",
        // "/models/pose-running.json",
        // "/models/pose-test.json"
    ],
    "stand": [
        // "/models/stand-circle.glb",
        // "/models/stand-hexagone.glb",
        // "/models/stand-scaled"
    ]
}

const { byPartTypeId, allPartTypeIds } = lib

export {
    byPartTypeId,
    allPartTypeIds
}