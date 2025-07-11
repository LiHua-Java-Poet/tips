import {get} from '@/api/index'

export function getTaskList(params) {
    return get('/app/task/list',params)
}