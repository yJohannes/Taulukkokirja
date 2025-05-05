export function getFromStorageList(key) {
    const raw = localStorage.getItem(key) || '[]';
    return JSON.parse(raw);
}

export function addToStorageList(key, item) {
    let list = getFromStorageList(key);

    if (!list.includes(item)) {
        list.push(item);
        localStorage.setItem(key, JSON.stringify(list));
    }
}
export function removeFromStorageList(key, item) {
    let list = getFromStorageList(key);

    const index = list.indexOf(item);
    if (index !== -1) {
        list.splice(index, 1);
        localStorage.setItem(key, JSON.stringify(list));
    }
}
