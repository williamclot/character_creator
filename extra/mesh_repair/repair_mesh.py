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

def remesh(mesh, detail="low"):
    '''Remeshing algorithm: good to repair weird meshes'''
    bbox_min, bbox_max = mesh.bbox;
    diag_len = norm(bbox_max - bbox_min);
    if detail == "normal":
        target_len = diag_len * 5e-3;
    elif detail == "high":
        target_len = diag_len * 2.5e-3;
    elif detail == "low":
        target_len = diag_len * 1e-2;
    print("Target resolution: {} mm".format(target_len));

    count = 0;
    mesh, __ = pymesh.remove_degenerated_triangles(mesh, 100);
    mesh, __ = pymesh.split_long_edges(mesh, target_len);
    num_vertices = mesh.num_vertices;
    while True:
        mesh, __ = pymesh.collapse_short_edges(mesh, 1e-6);
        mesh, __ = pymesh.collapse_short_edges(mesh, target_len,
                preserve_feature=True);
        mesh, __ = pymesh.remove_obtuse_triangles(mesh, 150.0, 100);
        if mesh.num_vertices == num_vertices:
            break;

        num_vertices = mesh.num_vertices;
        print("#v: {}".format(num_vertices));
        count += 1;
        if count > 10: break;

    mesh = pymesh.resolve_self_intersection(mesh);
    mesh, __ = pymesh.remove_duplicated_faces(mesh);
    mesh = pymesh.compute_outer_hull(mesh);
    mesh, __ = pymesh.remove_duplicated_faces(mesh);
    mesh, __ = pymesh.remove_obtuse_triangles(mesh, 179.0, 5);
    mesh, __ = pymesh.remove_isolated_vertices(mesh);

    return mesh;

def self_intersections(mesh):
    '''Tries to repair self intersections: doesn't always work'''
    return pymesh.resolve_self_intersection(mesh, engine='auto')

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

print("Union between ArmR and HandR...")
ArmR = mesh_union(ArmR, HandR)

print("Union between ArmL and HandL...")
ArmL = mesh_union(ArmL, HandL)

print("Union between LegL and FootL...")
LegL = mesh_union(LegL, FootL)

print("Union between LegR and FootR...")
LegR = mesh_union(LegR, FootR)

Merged = pymesh.merge_meshes([ArmR, ArmL, LegL, LegR, Head])

print("Union between the Torso and all the other members...")
Torso = mesh_union(Torso, Merged)

print("Union between the Character and the Stand...\n")
Torso = mesh_union(Torso, Stand)

pymesh.save_mesh("/meshes/output-merged.stl", Torso)

print("Mesh merged successfully!")
print("--- %s seconds ---" % (time.time() - start_time))
