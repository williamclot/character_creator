import {
    Geometry, SphereGeometry, CylinderBufferGeometry,
    LineBasicMaterial, MeshStandardMaterial,
    Mesh, Line,
    Vector3, 
} from 'three'

export const sphereFactory = {
    buildSphere( withArrow = false ) {
        const color = 0xff0000 // red
        const material = new MeshStandardMaterial({ color })

        const sphere = new Mesh(
            new SphereGeometry( .05, 32, 32 ),
            material
        )

        if ( withArrow ) {
    
            const arrowTopPos = new Vector3( 0, .05, 0 )
    
            const lineGeometry = new Geometry
            lineGeometry.vertices.push(
                new Vector3( 0, 0, 0 ),
                arrowTopPos
            )
    
            const line = new Line(
                lineGeometry,
                new LineBasicMaterial({ color })
            )
            const arrowTop = new Mesh(
                new CylinderBufferGeometry( 0, .03, .03, 32, 14, false ),
                material
            )
    
            arrowTop.position.copy( arrowTopPos )
            line.add( arrowTop )
    
            sphere.add( line )

        }

        return sphere
    }
}