module.exports = function(server) {
    var io = require('socket.io')(server);
    var LCD = require('lcd');

    var avalible = true;

    io.on('connection', function(socket) {
        if (avalible) {
            avalible = false;
            var lcd = new LCD({
                rs: 12,
                e: 21,
                data: [5, 6, 17, 18],
                cols: 16,
                rows: 2
            });
            lcd.on('ready', function() {
                socket.emit('avalible', true);
                socket.on('message', function(data) {
                    lcd.clear();
                    lcd.setCursor(0, 0);
                    console.log(data);
                    lcd.print(data);
                })
            });
            // function print(str, pos) {
            //     pos = pos || 0;
            //     if (pos === str.length) {
            //         pos = 0;
            //     }
            //     lcd.print(str[pos]);
            //     setTimeout(function() {
            //         print(str, pos + 1);
            //     }, 300);
            // }
            socket.on('disconnect', function() {
                lcd.clear();
                lcd.close();
                avalible = true;
                io.emit('avalible', true);
            });
        } else {
            socket.emit('avalible', false);
        }
    });
}