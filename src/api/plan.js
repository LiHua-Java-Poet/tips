import {get,post} from '@/api/index'

export function getPlanList(params) {
    return get('/app/plan/list',params)
}

export function getPlanInfo(params){
    return get('/app/plan/info',params)
}

export function savePlan(data) {
    return post('/app/plan/save', data)
}

export function deliver(data) {
    return post('/app/plan/deliver', data)
}