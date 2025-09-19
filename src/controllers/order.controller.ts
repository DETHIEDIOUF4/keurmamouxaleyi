import { Request, Response } from 'express';
import { Order, IOrder } from '../models/order.model';
import { protect, admin } from '../middleware/auth';
import { sendOrderMail } from '../services/emailService';
import { generateOrderItemsExcelBuffer } from '../services/excelService';
import { notifyNewOrder } from './notification.controller';
import { sendWhatsAppText, notifyAdminsOnWhatsApp } from '../services/whatsappService';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req: Request, res: Response) => {
  try {
    const {
      items,
      totalAmount,
      address,
      personalInfo
    } = req.body;

    // Transform the new payload format to match the existing Order model
    const orderItems = items.map((item: any) => ({
      name: item.name || `Product ${item.product}`, // You might want to fetch the actual product name
      quantity: item.quantity,
      image: item.image || undefined, // Make image optional
      price: item.price,
      product: item.product // This will be converted to ObjectId by Mongoose
    })); 

    const personalInfoFormatted = {
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      email: personalInfo.email || '',
      phone: personalInfo.phoneNumber
    };

    const shippingAddress = {
      street: address,
      city: req.body.city || '',
      postalCode: req.body.postalCode || '',
      country: req.body.country || 'Senegal'
    };

    const order = new Order({
      user: req.user?._id, // Le user est optionnel
      orderItems,
      personalInfo: personalInfoFormatted,
      shippingAddress,
      itemsPrice: totalAmount,
      shippingPrice: 0,
      totalPrice: totalAmount
    });

    const createdOrder = await order.save();

    // Génère l'Excel en mémoire (Buffer)
    const excelBuffer = await generateOrderItemsExcelBuffer(createdOrder as IOrder);
    console.log("sending mail");
    console.log('Excel buffer size (bytes):', excelBuffer?.length || 0);

    // Prépare un tableau HTML détaillant les articles
    const itemRowsHtml = (createdOrder.orderItems || [])
      .map((it) => {
        const lineTotal = (it.quantity || 0) * (it.price || 0);
        return `<tr>
          <td>${it.name}</td>
          <td style="text-align:center;">${it.quantity}</td>
          <td style="text-align:right;">${it.price} FCFA</td>
          <td style="text-align:right;">${lineTotal} FCFA</td>
        </tr>`;
      })
      .join('');

    const itemsTableHtml = `
      <table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;max-width:680px;">
        <thead>
          <tr style="background:#f5f5f5;">
            <th align="left">Produit</th>
            <th align="center">Quantité</th>
            <th align="right">Prix unitaire</th>
            <th align="right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemRowsHtml}
        </tbody>
      </table>`;

    // Envoi de l'email à l'admin principal avec la pièce jointe Excel (buffer)
    await sendOrderMail(
      'serignemor1993@gmail.com',
      `Nouvelle commande #${createdOrder._id}`,
      `<p>Nouvelle commande passée par ${createdOrder.personalInfo.firstName} ${createdOrder.personalInfo.lastName}.</p>
      <p>Numero de telephone Client: ${createdOrder.personalInfo.phone}</p>
      ${itemsTableHtml}
      <p style="margin-top:8px;"><strong>Total à payer : ${createdOrder.totalPrice} FCFA</strong></p>
      <p>Voir le détail dans l'admin.</p>`,
      [
        {
          filename: `commande_${createdOrder._id}.xlsx`,
          content: excelBuffer,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ]
    );

    // Envoi de l'email au collaborateur admin
    await sendOrderMail(
      'serignemor1993@gmail.com', // Remplacez par l'email du collaborateur
      `Nouvelle commande #${createdOrder._id}`,
      `<p>Nouvelle commande passée par ${createdOrder.personalInfo.firstName} ${createdOrder.personalInfo.lastName}.</p>
      <p>Numero de telephone Client: ${createdOrder.personalInfo.phone}</p>
      ${itemsTableHtml}
      <p style="margin-top:8px;"><strong>Total à payer : ${createdOrder.totalPrice} FCFA</strong></p>
      <p>Voir le détail dans l'admin.</p>`,
      [
        {
          filename: `commande_${createdOrder._id}.xlsx`,
          content: excelBuffer,
          contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      ]
    );

    // Envoi d'un email de confirmation au client avec le détail
    if (createdOrder.personalInfo?.email) {
      await sendOrderMail(
        createdOrder.personalInfo.email,
        `Confirmation de votre commande #${createdOrder._id}`,
        `<p>Bonjour ${createdOrder.personalInfo.firstName} ${createdOrder.personalInfo.lastName},</p>
        <p>Votre commande a été bien prise en compte. Voici le récapitulatif :</p>
        ${itemsTableHtml}
        <p style="margin-top:8px;"><strong>Total à payer : ${createdOrder.totalPrice} FCFA</strong></p>
        <p>Nous vous recontacterons très prochainement pour la suite. Merci pour votre confiance.</p>`
      );
    }

    // Envoyer la notification sonore à tous les appareils connectés
    notifyNewOrder(
      createdOrder._id.toString(),
      `${createdOrder.personalInfo.firstName} ${createdOrder.personalInfo.lastName}`
    );

    // WhatsApp: message au client et aux gestionnaires
    // try {
    //   const clientPhone = createdOrder.personalInfo?.phone;
    //   const itemsSummary = (createdOrder.orderItems || [])
    //     .map(it => `• ${it.name} x${it.quantity} — ${it.price} FCFA`)
    //     .join('\n');
    //   const clientMsg =
    //     `Bonjour ${createdOrder.personalInfo.firstName},\n` +
    //     `Votre commande #${createdOrder._id} a été reçue.\n` +
    //     `Total: ${createdOrder.totalPrice} FCFA\n` +
    //     `Détail:\n${itemsSummary}\n` +
    //     `Merci pour votre confiance !`;

    //   if (clientPhone) {
    //     await sendWhatsAppText(clientPhone, clientMsg);
    //   }

    //   const adminMsg =
    //     `Nouvelle commande #${createdOrder._id} — ${createdOrder.personalInfo.firstName} ${createdOrder.personalInfo.lastName}\n` +
    //     `Téléphone: ${createdOrder.personalInfo.phone}\n` +
    //     `Total: ${createdOrder.totalPrice} FCFA\n` +
    //     `Produits:\n${itemsSummary}`;
    //   await notifyAdminsOnWhatsApp(adminMsg);
    // } catch (waErr) {
    //   console.error('Erreur envoi WhatsApp:', waErr);
    // }

    console.log("mail sent & whatsapp sent");

    res.status(201).json(createdOrder);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = new Date();
      order.status = 'processing';

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = new Date();
      order.status = 'delivered';

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getMyOrders = async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ user: req.user?._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
export const getOrders = async (req: Request, res: Response) => {
  try {
    // Tous les utilisateurs authentifiés (admin et agents) peuvent voir toutes les commandes
    const orders = await Order.find({}).populate('user', 'id name');
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error: any) {
    res.status(500).json({ 
      success: false,
      message: 'Server Error',
      error: error.message 
    });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = new Date();
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
export const getOrderStats = async (_req: Request, res: Response) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
          paidOrders: {
            $sum: { $cond: [{ $eq: ['$isPaid', true] }, 1, 0] }
          },
          deliveredOrders: {
            $sum: { $cond: [{ $eq: ['$isDelivered', true] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: stats[0]
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
}; 