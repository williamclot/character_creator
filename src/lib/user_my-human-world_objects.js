const lib = {
    "byCategory": {
        "Torso": [
            {
                "name": "CUBE TORSO",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/model.stl",
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
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/model.stl",
                "extension": "stl",
                "metadata": {
                }
            },  
        ],
        "ArmR": [
            {
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/model.stl",
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
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/model.stl",
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
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/model.stl",
                "extension": "stl",
                "metadata": {
                }
            },  
        ],
        "HandL": [
            {
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/model.stl",
                "extension": "stl",
                "metadata": {
                }
            },  
        ],
        "LegR": [
            {
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/model.stl",
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
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/model.stl",
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
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/model.stl",
                "extension": "stl",
                "metadata": {
                }
            },  
        ],
        "FootL": [
            {
                "name": "CUBE",
                "download_url": process.env.PUBLIC_URL + "http://localhost:3000/models/model.stl",
                "extension": "stl",
                "metadata": {
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