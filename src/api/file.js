import {get,post} from '@/api/index'

export function getFileList(params) {
    return get('/app/file/list',params)
}

export function saveFile(data) {
    return post('/app/file/save', data)
}

export function getFileInfo(params) {
    return get('/app/file/info',params)
}

export function saveDocument(data) {
    return post('/app/file/saveDocument', data)
}