import {get} from '@/api/index'


export function getUserDataTo() {
    return get('/app/public/getUserDataTo')
}