import request from '@/utils/request'

export const getUser = (id)=>{
    return request.get('/user/'+id)
}

export const postUser = (id)=>{
    return request.post('/'+id)

}

export const getTopics = ()=>{
    return request.get('topics')
}