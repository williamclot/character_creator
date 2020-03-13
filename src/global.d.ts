type CssModulesExport = { [className: string]: string };

declare module '*.scss' {
    const content: CssModulesExport;
    export default content;
}

declare module '*.css' {
    const content: CssModulesExport;
    export default content;
}
