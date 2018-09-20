#!/usr/bin/env python
"""STL union script using pymesh"""

__author__ = "William CLOT, williamclot.github.com"
__license__ = "MIT"
__date__ = "05/09/2018"

# Usage:
# docker run -it --rm -v `pwd`:/root `meshes`:/meshes qnzhou/pymesh python repair_mesh.py -v

## Libraries -------------------

import time
import pymesh
import numpy as np
from numpy.linalg import norm

## Functions -------------------

def load_mesh(fileName):
    '''loading mesh using pymesh'''
    return pymesh.load_mesh("/meshes/"+fileName+".stl");

def mesh_union(meshA, meshB):
    '''Mesh union between meshA and meshB, needs to be intersecting faces'''
    return pymesh.boolean(meshA, meshB, operation="union", engine="igl")

start_time = time.time()

## Opening up the files -------------------

ArmR = load_mesh("mesh-arm-r")
HandR = load_mesh("mesh-hand-r")
ArmL = load_mesh("mesh-arm-l")
HandL = load_mesh("mesh-hand-l")
Head = load_mesh("mesh-head")
LegL = load_mesh("mesh-leg-l")
FootL = load_mesh("mesh-foot-l")
LegR = load_mesh("mesh-leg-r")
FootR = load_mesh("mesh-foot-r")
Torso = load_mesh("mesh-torso")
Stand = load_mesh("stand")

## Unions -------------------

A = pymesh.merge_meshes([HandR, HandL, FootR, FootL, Torso])
B = pymesh.merge_meshes([ArmR, ArmL, Head, LegL, LegR, Stand])

Output = mesh_union(A, B)

pymesh.save_mesh("/meshes/myCharacter.stl", Output)

print("Mesh merged successfully!")
print("--- %s seconds ---" % (time.time() - start_time))
