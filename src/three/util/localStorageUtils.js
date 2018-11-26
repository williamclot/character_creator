class LocalStorageWrapper {
    /**
     * @param { Storage } localStorage 
     */
    constructor(localStorage) {
        this.ls = localStorage;
    }

    isSet(key) {
        return this.ls.getItem(key) !== null;
    }

    get isSelectedMeshSet() {
        return this.isSet("selectedMesh");
    }

    get isLoadedMeshesSet() {
        return this.isSet("loadedMeshes");
    }

    get selectedMesh() {
        return this.ls.getItem("selectedMesh");
    }
    
    set selectedMesh(value) {
        this.ls.setItem("selectedMesh", value);
        return value;
    }
    
    get loadedMeshes() {
        return JSON.parse(this.ls.getItem("loadedMeshes"));
    }
    
    set loadedMeshes(value) {
        this.ls.setItem("loadedMeshes", JSON.stringify(value));
        return value;
    }
    
    getSingleLoadedMesh(key) {
        const loadedMeshes = this.loadedMeshes;
        return loadedMeshes[key];
    }
    
    setSingleLoadedMesh(key, value) {
        const oldLoadedMeshes = this.loadedMeshes;
        const newLoadedMeshes = {
            ...oldLoadedMeshes,
            [key]: value
        };

        this.loadedMeshes = newLoadedMeshes;
        return value;
    }
}

export default new LocalStorageWrapper( window.localStorage );
export { LocalStorageWrapper }
