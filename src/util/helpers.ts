let _id = 0;
export const uniqueId = (prefix = '') => {
    return `${prefix}_${_id++}`;
};

export const triggerDownloadFromUrl = (
    url: string,
    filename = 'customized-mesh',
) => {
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.style.display = 'none';
    anchor.download = filename;

    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
};

type Dict<T> = Record<string, T>;
/**
 * Calls a defined callback function on each property of an object,
 * and returns a new object that contains the results.
 */
export const objectMap = <T, S>(
    object: Dict<T>,
    mapFn: (value: T, key: string) => S,
) => {
    return Object.keys(object).reduce<Dict<S>>((result, key) => {
        result[key] = mapFn(object[key], key);
        return result;
    }, {});
};

export const getNameAndExtension = (filename: string) => {
    const dotIndex = filename.lastIndexOf('.');
    const hasDot = dotIndex !== -1;

    const name = hasDot ? filename.slice(0, dotIndex) : filename;
    const extension = filename.slice(dotIndex + 1);

    return { name, extension };
};

/**
 * get normalized mouse coordinates
 */
export function fromEvent(event: MouseEvent) {
    const {
        left,
        top,
        width,
        height,
    } = (event.target as HTMLElement).getBoundingClientRect();

    return {
        x: ((event.clientX - left) / width) * 2 - 1,
        y: (-(event.clientY - top) / height) * 2 + 1,
    };
}

export const radiansToDegreesFormatter = {
    format: (number: number) => {
        // const degreeSign = String.fromCharCode(176)
        // return `${value}${degreeSign}`

        return number * (180 / Math.PI);
    },
    parse: (text: string) => {
        const number = Number.parseFloat(text);
        return number / (180 / Math.PI);
    },
};

export const getSelectionFromHash = () => {
    // check location hash for initial selected parts
    const hash = window.location.hash.slice(1);
    if (hash !== '') {
        return JSON.parse(hash) as number[];
    }

    return [];
};

export const arraysEqual = <T>(arr1: T[], arr2: T[]) => {
    if (arr1.length !== arr2.length) return false;

    const s1 = new Set(arr1);
    const s2 = new Set(arr2);
    for (const el of s1) {
        if (!s2.has(el)) {
            return false;
        }
    }

    return true;
};
