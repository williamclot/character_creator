export const getCategories = groups => {
    return groups.reduce(
        ( categories, group ) => categories.concat( group.categories ),
        []
    )
}
