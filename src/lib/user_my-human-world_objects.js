const lib = {
    "byCategory": {
        "Torso": [
            {
                "name": "Cylinder",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cylinder.stl",
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
                "name": "CUBE TORSO",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cube.stl",
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
        "Head": [
            {
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "scale": .4
                }
            },  
        ],
        "ArmR": [
            {
                "name": "Cylinder",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cylinder.stl",
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
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cube.stl",
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
        "ArmL": [
            {
                "name": "Cylinder",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cylinder.stl",
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
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cube.stl",
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
        "HandR": [
            {
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "scale": .4
                }
            },  
        ],
        "HandL": [
            {
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "scale": .4
                }
            },  
        ],
        "LegR": [
            {
                "name": "Cylinder",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cylinder.stl",
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
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cube.stl",
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
        "LegL": [
            {
                "name": "Cylinder",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cylinder.stl",
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
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cube.stl",
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
        "FootR": [
            {
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "scale": .4
                }
            },  
        ],
        "FootL": [
            {
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/cube.stl",
                "extension": "stl",
                "metadata": {
                    "scale": .4
                }
            },  
        ]
    },
    "allCategories": [
        "Torso",
        "Head",
        "ArmR",
        "ArmL",
        "HandR",
        "HandL",
        "LegR",
        "LegL",
        "FootR",
        "FootL"
    ],
    "poses": [
        // "http://localhost:3000/models/pose-dab.json",
        // "http://localhost:3000/models/pose-default.json",
        // "http://localhost:3000/models/pose-egypt.json",
        // "http://localhost:3000/models/pose-gedan_barai.json",
        // "http://localhost:3000/models/pose-king_kong.json",
        // "http://localhost:3000/models/pose-running.json",
        // "http://localhost:3000/models/pose-test.json"
    ],
    "stand": [
        // "http://localhost:3000/models/stand-circle.glb",
        // "http://localhost:3000/models/stand-hexagone.glb",
        // "http://localhost:3000/models/stand-scaled"
    ]
}

const { byCategory, allCategories } = lib

export {
    byCategory,
    allCategories
}