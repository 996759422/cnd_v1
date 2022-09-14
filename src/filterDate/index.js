export const filterDate = (date) => {
    const create_date = date.split('T')[0]
    const create_time = date.split('T')[1].split('.')[0]
    return `${create_date} ${create_time}`
}

export const filterYear = (date) => {
    const create_date = date.split('T')[0]
    const create_time = date.split('T')[1].split('.')[0]
    return `${create_date}`
}

export const moment = (date) => {
    var moment = require('moment');
    moment.locale('zh-cn')
    const data = moment(date.split('T')[0]).fromNow()
    return `${data}`
}