import { Request, Response } from 'express';

// Stockage des connexions SSE actives
const clients: Response[] = [];

export const setupSSEConnection = (req: Request, res: Response) => {
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

// Fonction pour envoyer une notification à tous les clients
export const sendNotificationToAll = (type: string, data: any) => {
  const message = `data: ${JSON.stringify({ type, ...data })}\n\n`;
  
  clients.forEach(client => {
    try {
      client.write(message);
    } catch (error) {
      console.error('Erreur lors de l\'envoi de notification:', error);
    }
  });
};

// Fonction pour notifier d'une nouvelle commande
export const notifyNewOrder = (orderId: string, customerName: string) => {
  sendNotificationToAll('new_order', {
    orderId,
    customerName,
    timestamp: new Date().toISOString()
  });
};



