This project is a React component that is imported into the [MyMiniFactory](https://www.myminifactory.com/) website.

It renders a generic customizer where you can pick between a set of 3D parts and displays them on the screen using [threejs](https://threejs.org/). You pass the parts to pick from as props and the customizer takes care of displaying them on the screen.

## How it works
You must provide the hierarchy that represents your customizable 3D object.
For example, if you want to have a human with customizable Body, Head, Arms and Hands, the hierarchy would have the following structure:
```
Body {
  Head,
  Left Arm {
    Left Hand
  },
  Right Arm {
    Right Hand
  }
}
```
Then you can provide files for each part in the hierarchy with some required metadata and the customizer figures out where to display them based on the metadata of the file and on the position within the hierarchy.

## Props
Api for props not finalized yet

## Roadmap
- poses are still a work in progress
- support file formats that include skinning information (currently only renders `.stl` files)

## Examples
You can find a list of examples [here](https://www.myminifactory.com/customize)
