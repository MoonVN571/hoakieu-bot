const express = require("express");
const client = require('../index');
const { decrypt } = require("../functions/crypt");
const { Colors } = require("discord.js");
const app = express();
app.use(express.json())
app.post("/gachthe", async (req, res) => {
    let { TaskId, requestid, Pin, Seri, Amount, declared_value, Success } = req.body;
    const callback = JSON.parse(decrypt(requestid));
    console.log(callback);
    res.send({ status: true, msg: "done!" });
    client.channels.cache.get(callback.channelId).messages.fetch(callback.msgId).then(msg => {
        msg.edit({
            content: '',
            embeds: [{
                author: { name: `${TaskId}` },
                footer: { text: "doithesieure.vn" },
                fields: [{
                    name: "Số seri",
                    value: Seri,
                    inline: true
                }, {
                    name: "Mã thẻ",
                    value: Pin,
                    inline: true
                }, {
                    name: "Mệnh giá",
                    value: Intl.NumberFormat().format(declared_value) + " VNĐ",
                    inline: true
                }, {
                    name: "Thực nhận",
                    value: Intl.NumberFormat().format(Amount) + " VNĐ",
                    inline: true
                }, {
                    name: "Trạng thái",
                    value: (Success ? "Thành công!" : "Thẻ lỗi!"),
                    inline: true
                }, {
                    name: "Người gửi",
                    value: callback.tag,
                    inline: true
                }],
                color: (Success ? Colors.Green : Colors.Red),
                timestamp: new Date().toISOString()
            }]
        })
    });
});
app.listen(process.env.PORT || 3000, () => {
    console.log('Listening')
});