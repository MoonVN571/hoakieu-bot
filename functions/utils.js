const client = require('..');
module.exports.formatNum = (number) => Intl.NumberFormat().format(number);
module.exports.getUser = async id => {
    let user;
    await client.users.fetch(id).then(u => user = u).catch(err => { });
    return user;
}
module.exports.getTime = (time, better, format) => {
    let days = parseInt(time / 86400),
        hours = parseInt((time - days * 86400) / 3600),
        minutes = parseInt((time - days * 86400 - hours * 3600) / 60),
        seconds = parseInt(time % 60),
        timeArray = [days, hours, minutes, seconds];
    if (!format) format = ['d ', 'h ', 'm ', 's '];
    let str = "";
    for (let i = 0; i < 4; i++) {
        let def = `${timeArray[i]}${format[i]}`;
        if (better && timeArray[i] > 0) str += def
        else if (!better) str += def;
    }
    return str.trim();
}