import mongoose from 'mongoose';
import { products } from '../data/products';
import { Product } from '../models/Product';
import Category from '../models/Category';
import { categories } from '../data/categories';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('Connecté à MongoDB');

    // Supprimer les données existantes
    await Product.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log('Données supprimées');

    // Créer un utilisateur admin
    const adminUser = await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@example.com',
      password: 'hellogassy123',
      role: 'admin'
    });

    // Créer un utilisateur normal
    await User.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    });

    // Ajouter les catégories enfants (vêtements & jouets)
    await Category.insertMany(categories);

    // Ajouter les produits
    const sampleProducts = products.map(product => {
      return { ...product };
    });

    await Product.insertMany(sampleProducts);

    console.log('Données importées avec succès');
    process.exit();
  } catch (error) {
    console.error(`Erreur: ${error}`);
    process.exit(1);
  }
};

seedDatabase(); 