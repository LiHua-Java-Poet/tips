import {get,post} from '@/api/index'

export function getDictClassifyList(params) {
    return get('/app/sysDictClassify/list',params)
}

export function addDictClassify(params) {
    return post('/app/sysDictClassify/save',params)
}

export function deleteDictClassify(data) {
    return post('/app/sysDictClassify/delete', data)
}

export function getDictList(params) {
    return get('/app/sysDict/list',params)
}

export function addDict(data) {
    return post('/app/sysDict/save', data)
}

export function updateDict(data) {
    return post('/app/sysDict/update', data)
}

export function deleteDict(data) {
    return post('/app/sysDict/delete', data)
}