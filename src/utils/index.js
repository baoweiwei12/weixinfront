/**
 * 格式化日期时间字符串为指定格式
 * @param {string} dateStr - ISO 8601 格式的日期时间字符串
 * @returns {string} 格式化后的日期时间字符串，格式为 'YYYY-MM-DD HH:mm:ss'
 */
export function formatDateTime(dateStr) {
    let date = new Date(dateStr);

    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

/**
 * 检查当前日期是否在指定的起始日期和结束日期之间。
 * 
 * @param {String|Date} startDate - 起始日期，可以是Date对象或符合ISO 8601标准的字符串。
 * @param {String|Date} endDate - 结束日期，可以是Date对象或符合ISO 8601标准的字符串。
 * @returns {Boolean} 如果当前日期在起始日期和结束日期之间（包括起始和结束日期本身），则返回true；否则返回false。
 */
export function isTodayInRange(startDate, endDate) {
    // 获取当前日期和时间的Date对象。
    // 获取今天的日期
    const today = new Date();

    // 将起始日期和结束日期字符串转换为Date对象。
    // 如果参数已经是Date对象，则此步骤无效。
    // 将传入的日期转换为Date对象
    const start = new Date(startDate);
    const end = new Date(endDate);

    // 检查当前日期是否在起始日期和结束日期之间（包括两者）。
    // 判断今天是否在区间内（包括开始日期和结束日期）
    return today >= start && today <= end;
}