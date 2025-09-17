"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyNewOrder = exports.sendNotificationToAll = exports.setupSSEConnection = void 0;
// Stockage des connexions SSE actives
const clients = [];
const setupSSEConnection = (req, res) => {
    // Configurer les headers pour SSE
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
    });
    // Envoyer un message de connexion
    res.write(`data: ${JSON.stringify({ type: 'connection', message: 'Connected to SSE' })}\n\n`);
    // Ajouter le client à la liste
    clients.push(res);
    // Gérer la déconnexion
    req.on('close', () => {
        const index = clients.indexOf(res);
        if (index !== -1) {
            clients.splice(index, 1);
        }
    });
};
exports.setupSSEConnection = setupSSEConnection;
// Fonction pour envoyer une notification à tous les clients
const sendNotificationToAll = (type, data) => {
    const message = `data: ${JSON.stringify(Object.assign({ type }, data))}\n\n`;
    clients.forEach(client => {
        try {
            client.write(message);
        }
        catch (error) {
            console.error('Erreur lors de l\'envoi de notification:', error);
        }
    });
};
exports.sendNotificationToAll = sendNotificationToAll;
// Fonction pour notifier d'une nouvelle commande
const notifyNewOrder = (orderId, customerName) => {
    (0, exports.sendNotificationToAll)('new_order', {
        orderId,
        customerName,
        timestamp: new Date().toISOString()
    });
};
exports.notifyNewOrder = notifyNewOrder;
