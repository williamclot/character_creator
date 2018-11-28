#!/usr/bin/env node

const fs = require('fs')

const file = "allLibs.json"

const json = JSON.parse( fs.readFileSync(file) )

const dirName = "./processed"

for ( let [ categoryId, data ] of Object.entries(json) ) {
    console.log(categoryId)


    const processedData = data.map(
        item => {
            const {
                name,
                img, 
                rotation,
                scale: scaleXYZ,
                absoluteURL
            } = item

            return {
                url: absoluteURL,
                categoryName: categoryId,
                metadata: {
                    rotation,
                    scale: {
                        x: scaleXYZ,
                        y: scaleXYZ,
                        z: scaleXYZ
                    }
                },
                extension: "glb"
            }
        }
    )


    fs.writeFileSync( `${ dirName }/${ categoryId }.json`, JSON.stringify( processedData, null, 4) )

    

}
