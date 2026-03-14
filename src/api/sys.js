import {get,post} from '@/api/index'

export function getConfigList(params) {
    return get('/app/sysConfig/list',params)
}

export function addConfig(data) {
    return post('/app/sysConfig/save', data)
}

export function deleteTask(data) {
    return post('/app/sysConfig/delete', data)
}