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
                cols: 8,
                rows: 2
            });
            lcd.on('ready', function() {
                lcd.setCursor(16, 0);
                lcd.autoscroll();
                socket.emit('avalible', true);

                socket.on('message', function(data) {
                    console.log(data);
                    lcd.clear();
                    lcd.print(data);
                })
            });
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