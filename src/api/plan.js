import {get} from '@/api/index'

export function getPlanList(params) {
    return get('/app/plan/list',params)
}

export function getPlanInfo(params){
    return get('/app/plan/info',params)
}