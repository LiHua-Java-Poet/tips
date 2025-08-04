import {get,post} from '@/api/index'

export function getSessionList(params) {
    return get('/app/session/list',params)
}

export function saveSession(data) {
    return post('/app/session/save', data)
}