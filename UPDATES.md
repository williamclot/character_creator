## Daily update sheet of the progression of the project

> I'll try to update this a frequently as possible for you to keep an eye on what I'm working on.
>
> -- William CLOT


**03/07/18:**
Tasks and directions were discussed, the bigger axes of the project are for the moment:

- findind a way to integrate the reference skeleton (maybe with Three.js)
- think of the UI straight away (did a first version on adobe XD)
- look up react.js to have a clean code and application
- check for open source customization tools

**04/07/18:**

- Starting to design the interface (trying stuff with react.js)
- First decided to implement it without react.js and then add some elements of react.js to it later on

**05/07/18:**

- Learning more about React.js, did the entire tictactoe tutorial using react.js (see myminifactory.williamclot.com)
- Implemented some features of React.js on the UI: the categories are dynamically added to the interface via a json file


**06/07/18:**

- Continuing to learn React.js and implementing it in the UI that I designed

**09/07/18:**

- Implementing React.js in depth with the UI design
- Dividing the UI in React components and putting them in the subfolder `components/`

**17/07/18:**

- Having fun with Three.js, learning about skeleton and skinned meshes within the framework. 
- Coded a small test project and replaced meshes with the relative skeleton. Works well with heads, arms and hands for the moment. Will continue to work on this with torsos, legs and feet.
- Reading stuff on three.js interaction with React (it's unfortunatly not the easiest mix)

**19/07/18:**

- Rewritting the code of Three.js with some easy to use functions (`changeMesh()` and `placeMesh()`).
- Combining React.js with a global function within Three.js to change the mesh of the head.

**23/07/18:**

- Additional features on the reactjs UI: there is now a Left/Right menu for all the dual body parts (hands, arms, legs, foots). As is today this enables the user to change only one hand at a time and have differents meshes on the right and left hand).
- The react scheme used here is the following: the component `Category` as a state with the value `isLeft`. This value is then parsed to the sub Component `Selector` which updates this value using the well known trick. 
- I also tried to implement a color switcher to accentuate the color of the current mesh that's being updated. (Still some work to do on that...)
  
**24/07/18:**

- Designed a blender file that enables me to take renders of each element for a uniform look with the app.

**25/07/18:**

- Fixed some minor issues with the css grid layout for the selector panel.
- Added the implementation for the selection of arms with a recursive replacement of the childs of the element. Works well but the code is pretty discusting: will need to rethink it throw and simply as much as possible my implementation.
- Designed a few additionnal parts (robot hands and arms).

**26/07/18:**

- Rebuild entirely the threejs code with a recursive function that update automatically the children of a mesh. Works really well which is good, feels like this is the best implementation of the mesh replacement algorithm.
- Added the implementation for torsos.

**27/07/18**:

- Finished the recursive function with all the body parts, a modification of:
    - torso calls his children (ArmR, ArmL, Head, LegR, LegL)
    - ArmR and ArmL calls respectively HandR and HandL
    - LegR and LegL calls respectively FootR and FootL
- Adding some items in the library, a lot of blender stuff to finish
- TODO next week:
    - Finish the coloring system for quick mesh identification in the interface. 
    - Add elements in the library (objective is to have a scrolling bar in each category)
    - Backend implementation with the MMF API
    - Look at the STL exporter

**30/07/18**:

- Created a colouring system that enables the user to quickly understand which mesh is being replaced.
- Added a few new elements to the blender library
- Looked at the STL exporter (doesn't work, all the meshes are at the middle of the scene...)

**03/08/18/**:

- Spend 3 days finding a way to export STL from GLB skinned meshes. The solutions was to use a custom STLExporter coupled with a few modifications in the three.js core. In the function `fromBufferGeometry` that can be found in `src/core/Geometry.js` of threejs I had to add a few lines:

```js
var skinIndices = attributes.skinIndex !== undefined ? attributes.skinIndex.array : undefined;
var skinWeights = attributes.skinWeight !== undefined ? attributes.skinWeight.array : undefined;

for ( var i = 0, j = 0, k=0; i < positions.length; i += 3, j += 2, k+=4 ) {
    {...}
    if ( skinIndices !== undefined ) {
        scope.skinIndices.push( new Vector4( skinIndices[ k ], skinIndices[ k + 1 ], skinIndices[ k + 2 ], skinIndices[ k + 3 ] ) );
    }
	if ( skinWeights !== undefined ) {
		scope.skinWeights.push( new Vector4( skinWeights[ k ], skinWeights[ k + 1 ], skinWeights[ k + 2 ], skinWeights[ k + 3 ] ) );
	}
}
```

**06/08/18**:

- Implemented a first approach of the pose selector. The UI is working okay, I have two tabs a first tab for selecting within a list of poses and the second one for editing and twinking an existing pose. 
- Have to work a bit more on this.. Take into consideration the original position of the mesh.


**07/08/18**:

- Updated and corrected some meshes: the arms all have a default rotation of {0;0;0} so that the pose implementation will work without a inverse rotation of certain body parts.
- Added a couple poses in the library (Need to add new legs and torso to really check what i'm doing)
- Worked on the base (Just the beggining lots of work still to do, working on bounding boxes of the two foots, one needs to be on the floor or translated)

**08/08/18**:

- Worked again on the stand implementation. 
- It's more difficult than planned, the bounding box stays where the mesh was loaded but not were the mesh has been mooved with the bones... Same problem as the STL export function. 
- Two possibilities, either I add bones to find the place in space where the foot ends or I remodify a core threejs file and see how it goes. Will look at this tomorrow.

**09/08/18**:

- Did loads of things today. Happy with the progression made, I worked on correcting the stand position alignment. I opted for computing the GPU calculations of the position of the mesh geometry and looked for the minimal value along the y axis. This code is added in the FindMinGeometry.js file.
- Finished working on the pose implementation and with the stand (foot position will change so the stand as to move as well)
- Corrected the colouring scheme for pose selection.
- Things left to do:
    - Clear up the code (maybe slice the categories into react components)
    - Add the UI for stand selection + threejs implementation
    - Add a mention of the author in the UI

**10/08/18**:

- Corrected the STL Exporter Size
- Corrected a few problems with the pose implementation
- Added the export STL name to the "give it a name" value
- TODO next week: 
    - I still have to clean up the code
    - Add option to change stand and size
    - Copyright + link to MMF
    - Add library items with Antoine & Loïc


**13/08/18**:

- Fix Firefox weird display of the category images
- Fix CSS grid on safari
- Changed the theme of the customizer to look not look like hero forge
- Fixed the height of the stand by moving the body and not the stand itself
- Still todo:
    - Google Analytics
    - Add a pay 4.99 button
    - ...


**14/08/18**:

- Added Google Analytics to the website with event base tracking with the following actions:
    - Print for £4.99
    - Download as STL
    - Cliked on Head

**15/08/18**:

- Did all the modifications that Romain Kidd wanted me to do:
    - Change a few buttons names and position
    - Change name of website
    - Add licensing information and other stuff
- Corrected the old bug of simultanous loads by modifying slightly skeleton.js
- Added the UI and the functions to load and change new terrains and stands

**16/08/18**:

- Modified Google Analytics so that for each STL export we have the information of which part were used.
- Created two custom reports on the google analytics platform
- Fixed color implementation with the stands
- Changed the URL to https://myminifactory.com/character_creator/
