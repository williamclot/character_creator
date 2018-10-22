import React, { Component } from "react";
import Editor from "./Editor";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import SearchBar from "./SearchBar";
import "../css/selector.css";

import headElements from "../library/heads.json";
import handElements from "../library/hands.json";
import armElements from "../library/arm.json";
import torsoElements from "../library/torso.json";
import footElements from "../library/foot.json";
import legElements from "../library/leg.json";
import standElements from "../library/stands.json";
import poseElements from "../library/poses.json";
import bones from "../library/bones.json";
import config from "../config.js";

class Selector extends Component {
	constructor(props) {
		super(props);
		this.state = {
			editorSelected: false,
			pose: undefined,
			search: ""
		};
	}

	componentDidMount() {
		// Load the base model with defaultMeshes and defaultPose
		axios.get("models/poses/default.json").then(res => {
			this.setState({ pose: res.data });
			window.loadDefaultMeshes(bones, res.data);
		});
	}

	updateSearchValue = search => {
		this.setState({ search });
	};

	applyPose(file) {
		let poseData;
		//Ajax in react
		axios.get("models/poses/" + file + ".json").then(res => {
			poseData = res.data;
			this.setState({ pose: poseData });
			window.loadPose(poseData, bones);
		});
	}

	RenderPremium(item) {
		if (item.premium) {
			return (
				<div className="abs premium">
					<FontAwesomeIcon
						className="abs centered white big-icon"
						icon="dollar-sign"
					/>
				</div>
			);
		}
	}

	RenderLink(item) {
		if (item.link) {
			return (
				<a className="abs link" href={item.link}>
					<FontAwesomeIcon
						className="abs centered white icon"
						icon="link"
					/>
				</a>
			);
		}
	}

	handleLoadMore = async e => {
		console.log(config.BASE_URL, config.ACCESS_TOKEN);
		const params = {
			q: "default head",
			tag: "customizer",
		};
		if(!config.isProduction) {
			params['access_token'] = config.ACCESS_TOKEN;
		}

		const { data } = await axios.get(config.BASE_URL + "/api/v2/search", { params });

		const glbs = data.items.filter(item => 
			item.files.items.find(file => file.filename.endsWith('.glb'))
		);
		console.log(glbs);


		/*const partData = {
			"name": "Default Head",
			"img": "default.png",
			"file": "",
			"author": "William CLOT",
			"description": "Default man head.",
			"rotation": {
				"x": 0,
				"y": 0,
				"z": 0
			},
			"scale": 1, 
			"link": ""
		};
		window.changeMesh(
			this.props.currentCategory,
			partData,
			this.props.isLeft,
			bones,
			this.state.pose,
			'tmp/default-head.glb'
		);*/
	}

	handleClick(libraryData, category, isLeft, event) {
		let meshType;
		switch (category) {
			case "torso":
				meshType = "Torso";
				break;
			case "head":
				meshType = "Head";
				break;
			case "hand":
				meshType = isLeft ? "HandL" : "HandR";
				break;
			case "arm":
				meshType = isLeft ? "ArmL" : "ArmR";
				break;
			case "foot":
				meshType = isLeft ? "FootL" : "FootR";
				break;
			case "leg":
				meshType = isLeft ? "LegL" : "LegR";
				break;
			default:
				meshType = undefined;
		}
		if (libraryData.premium) {
			this.props.updatePopupMessage(
				"Sorry this is a premium object, this feature is still in development..."
			);
			this.props.updatePopup(true);
		} else {
			if (category === "pose") {
				this.applyPose(libraryData.file);
			} else if (category === "stand") {
				window.changeStand(libraryData.file);
			} else {
				this.props.updateLoading(true);
				window.changeMesh(
					category,
					libraryData,
					isLeft,
					bones,
					this.state.pose
				);
				let loadedMeshes = this.props.loadedMeshes;
				loadedMeshes[meshType] = libraryData.file;
				this.props.updateMeshes(loadedMeshes);
			}
		}
	}

	render() {
		// Passing through the state from the properties
		const category = this.props.currentCategory;
		const isLeft = this.props.isLeft;

		const categoryInfo = {
			head: {
				library: headElements,
				sideIdencator: false
			},
			hand: {
				library: handElements,
				sideIdencator: true
			},
			arm: {
				library: armElements,
				sideIdencator: true
			},
			torso: {
				library: torsoElements,
				sideIdencator: false
			},
			foot: {
				library: footElements,
				sideIdencator: true
			},
			leg: {
				library: legElements,
				sideIdencator: true
			},
			pose: {
				library: poseElements,
				sideIdencator: false
			},
			stand: {
				library: standElements,
				sideIdencator: false
			}	
		};
		const {
			library = headElements,
			sideIdencator = false
		} = categoryInfo[category];

		let filteredlibrary = library.filter(
			(element) => {
				return element.name.toLowerCase().indexOf(this.state.search) !== -1;
			}
		);


		//JSX element to display the HTML
		const elementDiv = filteredlibrary.map((libraryData, i) => (
			<div
				className="el"
				key={i}
				onClick={this.handleClick.bind(this, libraryData, category, isLeft)} // bine some variables
			>
				<div className="img">
					<img
						src={
							"img/library/" + category + "/" + libraryData.img
						}
						alt={libraryData.img}
					/>
				</div>
				<div className="unselectable el-name">
					{libraryData.name}
				</div>
				{this.RenderPremium(libraryData)}
				{this.RenderLink(libraryData)}
			</div>
		));

		// add "Add your designs" button
		elementDiv.push(
			<div
				className="el"
				key="add"
				onClick={() => {
					this.props.updatePopup(true);
					this.props.updatePopupMessage(
						"Sorry this feature is still in development..."
					);
				}}
			>
				<div className="img">
					<img
						src="img/library/plus.svg"
						alt="plus sign"
					/>
				</div>
				<div className="unselectable el-name">Add your designs</div>
			</div>
		);

		// add "LoadMore" button
		elementDiv.push(
			<div
				className = "el"
				key = "loadMore"
				onClick={this.handleLoadMore}
			>
				Load More
			</div>
		);

		const buttons = (
			<div className="abs switch">
				<div
					className={
						"unselectable abs left side L " +
						(isLeft ? "side-selected" : "")
					}
					onClick={() => {
						this.props.updateLeft(true);
						var MeshType;
						switch (category) {
							case "head":
								MeshType = "Head";
								break;
							case "hand":
								MeshType = "HandL";
								break;
							case "arm":
								MeshType = "ArmL";
								break;
							case "torso":
								MeshType = "Torso";
								break;
							case "foot":
								MeshType = "FootL";
								break;
							case "leg":
								MeshType = "LegL";
								break;
							default:
								MeshType = undefined;
						}
						if (MeshType) {
							window.selectedMesh(MeshType);
						}
					}}
				>
					Left
				</div>
				<div
					className={
						"unselectable abs right side R " +
						(isLeft ? "" : "side-selected")
					}
					onClick={() => {
						this.props.updateLeft(false);
						var MeshType;
						switch (category) {
							case "head":
								MeshType = "Head";
								break;
							case "hand":
								MeshType = "HandR";
								break;
							case "arm":
								MeshType = "ArmR";
								break;
							case "torso":
								MeshType = "Torso";
								break;
							case "foot":
								MeshType = "FootR";
								break;
							case "leg":
								MeshType = "LegR";
								break;
							default:
								MeshType = undefined;
						}
						if (MeshType) {
							window.selectedMesh(MeshType);
						}
					}}
				>
					Right
				</div>
			</div>
		);

		const editorButtons = (
			<div className="abs switch">
				<div
					className={
						"unselectable abs left side L " +
						(this.state.editorSelected ? "" : "side-selected")
					}
					onClick={() => {
						this.setState({ editorSelected: false });
					}}
				>
					Poses
				</div>
				<div
					className={
						"unselectable abs right side R " +
						(this.state.editorSelected ? "side-selected" : "")
					}
					onClick={() => {
						this.setState({ editorSelected: true });
					}}
				>
					Editor
				</div>
			</div>
		);

		return (
			<div>
				<div className="abs top right right-side">
					<div className="box">
						<SearchBar updateSearchValue={this.updateSearchValue} />
						{sideIdencator ? buttons : ""}
						{category === "pose" && this.props.editor ? editorButtons : ""}
						<div
							className={
								"abs top left " +
								(category === "pose" && this.state.editorSelected
									? " selector"
									: " selector") +
								(sideIdencator ||
								(category === "pose" && this.props.editor)
									? " selector-full"
									: " selector")
							}
						>
							{category === "pose" &&
								this.state.editorSelected &&
								this.props.editor ? (
									<Editor />
								) : (
									<div className="abs top left selector-nopadding">
										{elementDiv}
									</div>
								)}
							
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Selector;
