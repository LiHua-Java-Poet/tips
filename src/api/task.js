import {get,post} from '@/api/index'

export function getTaskList(params) {
    return get('/app/task/list',params)
}

export function getTaskInfo(params){
    return get('/app/task/info',params)
}

export function cancelTask(data) {
    return post('/app/task/cancelTask', data)
}

export function completeTask(data) {
    return post('/app/task/completeTask', data)
}

export function deleteTask(data) {
    return post('/app/task/delete', data)
}

export function saveTask(data) {
    return post('/app/task/save', data)
}

export function updateTask(data) {
    return post('/app/task/update', data)
}