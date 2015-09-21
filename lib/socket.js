module.exports = function(server) {
    var io = require('socket.io')(server),
        LCD = require('lcd');

    var avalible = true;

    io.on('connection', function(socket) {
        if (avalible) {
            var lcd = new LCD({
                rs: 12,
                e: 21,
                data: [5, 6, 17, 18],
                cols: 16,
                rows: 2
            });
            avalible = false;
            lcd.on('ready', function() {
                socket.emit('avalible', true);
                socket.on('message', function(data) {
                    lcd.clear(function() {
                        if (data.content.length > 16) {
                            lcd.setCursor(0, 0);
                            lcd.print(data.content.substring(0, 16), function() {
                                lcd.setCursor(0, 1);
                                lcd.print(data.content.substring(16, 32));
                            });
                        } else {
                            lcd.setCursor(0, 0);
                            lcd.print(data.content);
                        }
                    });
                })
            });
            socket.on('disconnect', function() {
                lcd.clear();
                lcd.close();
                avalible = true;
            });
        } else {
            socket.emit('avalible', false);
        }
    });
}