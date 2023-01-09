const client = require('../../index');
client.on('channelDelete', async channel => {
    await client.users.fetch(channel.name).then(user => {
        user.send('Phòng của bạn đã được đóng lại!');
    }).catch(err => { });
});