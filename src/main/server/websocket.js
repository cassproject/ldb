let expressWs = require('express-ws')(global.app, global.server);
let wses = [];
app.ws('/ws/custom', function(ws, req) {
    wses.push(ws);
    global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'LdbWsCustom', 'Websocket connected.');
    ws.on('close', function(msg) {
        for (let i = 0; i < wses.length; i++) {
            if (wses[i] == ws) {
                wses.splice(i--, 1);
                global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.INFO, 'LdbWsCustom', 'closed');
            }
        }
    });
});
global.wsBroadcast = async (s) => {
    for (let ws of wses) {
        try {
            ws.send(s);
        } catch (err) {
            global.auditLogger.report(global.auditLogger.LogCategory.NETWORK, global.auditLogger.Severity.ERROR, 'LdbWsCustomError', err);
        }
    }
};
