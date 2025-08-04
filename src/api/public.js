import {get} from '@/api/index'


export function getUserDataTo() {
    return get('/app/public/getUserDataTo')
}

export function getUniqueCode() {
    return get('/app/task/getUniqueCode')
}