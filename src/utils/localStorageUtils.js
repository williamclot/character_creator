export const localStorageWrapper = {
    isSet(key) {
        return localStorage.getItem(key) !== null;
    },

    get isSelectedMeshSet() {
        return this.isSet("selectedMesh");
    },

    get isLoadedMeshesSet() {
        return this.isSet("loadedMeshes");
    },

    get selectedMesh() {
        return localStorage.getItem("selectedMesh");
    },
    
    set selectedMesh(value) {
        localStorage.setItem("selectedMesh", value);
        return value;
    },
    
    get loadedMeshes() {
        return JSON.parse(localStorage.getItem("loadedMeshes"));
    },
    
    set loadedMeshes(value) {
        localStorage.setItem("loadedMeshes", JSON.stringify(value));
        return value;
    },
    
    getSingleLoadedMesh(key) {
        const loadedMeshes = this.loadedMeshes;
        return loadedMeshes[key];
    },
    
    setSingleLoadedMesh(key, value) {
        const oldLoadedMeshes = this.loadedMeshes;
        const newLoadedMeshes = {
            ...oldLoadedMeshes,
            [key]: value
        };

        this.loadedMeshes = newLoadedMeshes;
        return value;
    }
};
