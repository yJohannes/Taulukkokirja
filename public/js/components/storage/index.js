export const StorageHelper = {
    getFromStorageJSON,
    getFromStorageList,
    addToStorageList,
    removeFromStorageList,
    setStorageItem,
}

function getFromStorageJSON(key) {
    const raw = localStorage.getItem(key) || '{}';
    return JSON.parse(raw);
}

function getFromStorageList(listName) {
    const raw = localStorage.getItem(listName) || '[]';
    return JSON.parse(raw);
}

function addToStorageList(listName, item, prepend=false) {
    let list = getFromStorageList(listName);

    
    if (!list.includes(item)) {
        if (prepend) {
            list.unshift(item);
        } else {
            list.push(item);
        }
        localStorage.setItem(listName, JSON.stringify(list));
    }
}

function removeFromStorageList(listName, item) {
    let list = getFromStorageList(listName);

    const index = list.indexOf(item);
    if (index !== -1) {
        list.splice(index, 1);
        localStorage.setItem(listName, JSON.stringify(list));
    }
}

function setStorageItem(itemName, item) {
    localStorage.setItem(itemName, JSON.stringify(item));
}