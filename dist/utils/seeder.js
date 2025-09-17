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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const products_1 = require("../data/products");
const Product_1 = require("../models/Product");
const Category_1 = __importDefault(require("../models/Category"));
const categories_1 = require("../data/categories");
const User_1 = require("../models/User");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const seedDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connexion à MongoDB
        yield mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Connecté à MongoDB');
        // Supprimer les données existantes
        yield Product_1.Product.deleteMany({});
        yield Category_1.default.deleteMany({});
        yield User_1.User.deleteMany({});
        console.log('Données supprimées');
        // Créer un utilisateur admin
        const adminUser = yield User_1.User.create({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: 'hellogassy123',
            role: 'admin'
        });
        // Créer un utilisateur normal
        yield User_1.User.create({
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            password: 'password123',
            role: 'user'
        });
        // Ajouter les catégories enfants (vêtements & jouets)
        yield Category_1.default.insertMany(categories_1.categories);
        // Ajouter les produits
        const sampleProducts = products_1.products.map(product => {
            return Object.assign({}, product);
        });
        yield Product_1.Product.insertMany(sampleProducts);
        console.log('Données importées avec succès');
        process.exit();
    }
    catch (error) {
        console.error(`Erreur: ${error}`);
        process.exit(1);
    }
});
seedDatabase();
