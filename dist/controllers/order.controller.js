"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrderStats = exports.updateOrderStatus = exports.getOrders = exports.getMyOrders = exports.updateOrderToDelivered = exports.updateOrderToPaid = exports.getOrderById = exports.createOrder = void 0;
const order_model_1 = require("../models/order.model");
const emailService_1 = require("../services/emailService");
const excelService_1 = require("../services/excelService");
const notification_controller_1 = require("./notification.controller");
// @desc    Create new order
// @route   POST /api/orders
// @access  Public
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { items, totalAmount, address, personalInfo } = req.body;
        // Transform the new payload format to match the existing Order model
        const orderItems = items.map((item) => ({
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
        const order = new order_model_1.Order({
            user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, // Le user est optionnel
            orderItems,
            personalInfo: personalInfoFormatted,
            shippingAddress,
            itemsPrice: totalAmount,
            shippingPrice: 0,
            totalPrice: totalAmount
        });
        const createdOrder = yield order.save();
        // Génère l'Excel en mémoire (Buffer)
        const excelBuffer = yield (0, excelService_1.generateOrderItemsExcelBuffer)(createdOrder);
        console.log("sending mail");
        console.log('Excel buffer size (bytes):', (excelBuffer === null || excelBuffer === void 0 ? void 0 : excelBuffer.length) || 0);
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
        yield (0, emailService_1.sendOrderMail)('serignemor1993@gmail.com', `Nouvelle commande #${createdOrder._id}`, `<p>Nouvelle commande passée par ${createdOrder.personalInfo.firstName} ${createdOrder.personalInfo.lastName}.</p>
      <p>Numero de telephone Client: ${createdOrder.personalInfo.phone}</p>
      ${itemsTableHtml}
      <p style="margin-top:8px;"><strong>Total à payer : ${createdOrder.totalPrice} FCFA</strong></p>
      <p>Voir le détail dans l'admin.</p>`, [
            {
                filename: `commande_${createdOrder._id}.xlsx`,
                content: excelBuffer,
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        ]);
        // Envoi de l'email au collaborateur admin
        yield (0, emailService_1.sendOrderMail)('serignemor1993@gmail.com', // Remplacez par l'email du collaborateur
        `Nouvelle commande #${createdOrder._id}`, `<p>Nouvelle commande passée par ${createdOrder.personalInfo.firstName} ${createdOrder.personalInfo.lastName}.</p>
      <p>Numero de telephone Client: ${createdOrder.personalInfo.phone}</p>
      ${itemsTableHtml}
      <p style="margin-top:8px;"><strong>Total à payer : ${createdOrder.totalPrice} FCFA</strong></p>
      <p>Voir le détail dans l'admin.</p>`, [
            {
                filename: `commande_${createdOrder._id}.xlsx`,
                content: excelBuffer,
                contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            },
        ]);
        // Envoi d'un email de confirmation au client avec le détail
        if ((_b = createdOrder.personalInfo) === null || _b === void 0 ? void 0 : _b.email) {
            yield (0, emailService_1.sendOrderMail)(createdOrder.personalInfo.email, `Confirmation de votre commande #${createdOrder._id}`, `<p>Bonjour ${createdOrder.personalInfo.firstName} ${createdOrder.personalInfo.lastName},</p>
        <p>Votre commande a été bien prise en compte. Voici le récapitulatif :</p>
        ${itemsTableHtml}
        <p style="margin-top:8px;"><strong>Total à payer : ${createdOrder.totalPrice} FCFA</strong></p>
        <p>Nous vous recontacterons très prochainement pour la suite. Merci pour votre confiance.</p>`);
        }
        // Envoyer la notification sonore à tous les appareils connectés
        (0, notification_controller_1.notifyNewOrder)(createdOrder._id.toString(), `${createdOrder.personalInfo.firstName} ${createdOrder.personalInfo.lastName}`);
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
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.createOrder = createOrder;
// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.Order.findById(req.params.id).populate('user', 'name email');
        if (order) {
            res.json(order);
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getOrderById = getOrderById;
// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.Order.findById(req.params.id);
        if (order) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.status = 'processing';
            const updatedOrder = yield order.save();
            res.json(updatedOrder);
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.updateOrderToPaid = updateOrderToPaid;
// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const order = yield order_model_1.Order.findById(req.params.id);
        if (order) {
            order.isDelivered = true;
            order.deliveredAt = new Date();
            order.status = 'delivered';
            const updatedOrder = yield order.save();
            res.json(updatedOrder);
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.updateOrderToDelivered = updateOrderToDelivered;
// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const orders = yield order_model_1.Order.find({ user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.getMyOrders = getMyOrders;
// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Tous les utilisateurs authentifiés (admin et agents) peuvent voir toutes les commandes
        const orders = yield order_model_1.Order.find({}).populate('user', 'id name');
        res.json({
            success: true,
            data: orders
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
});
exports.getOrders = getOrders;
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.body;
        const order = yield order_model_1.Order.findById(req.params.id);
        if (order) {
            order.status = status;
            if (status === 'delivered') {
                order.isDelivered = true;
                order.deliveredAt = new Date();
            }
            const updatedOrder = yield order.save();
            res.json(updatedOrder);
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// @desc    Get order statistics
// @route   GET /api/orders/stats
// @access  Private/Admin
const getOrderStats = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const stats = yield order_model_1.Order.aggregate([
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
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
});
exports.getOrderStats = getOrderStats;
