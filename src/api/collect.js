import {get,post} from '@/api/index'

export function getSessionList(params) {
    return get('/app/session/list',params)
}

export function saveSession(data) {
    return post('/app/session/save', data)
}

export function getMessageList(params) {
    return get('/app/message/list',params)
}

export function saveMessage(data) {
    return post('/app/message/save', data)
}

export function deleteMessage(data) {
    return post('/app/message/delete', data)
}