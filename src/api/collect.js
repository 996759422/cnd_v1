import request from "@/utils/request";
// 收藏
export const collectTopicById = (data) => {
    return request.post('/topic_collect/collect', data)
}
// 取消收藏
export const deCollectTopicById = (data) => {
    return request.post('/topic_collect/de_collect', data)
}
// 用户收藏的主题
export const getCollects = (params) => {
    return request.get('/topic_collect/' + params)
}