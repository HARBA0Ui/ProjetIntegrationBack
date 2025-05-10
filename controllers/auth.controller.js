import prisma from "../db/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { nom, email, motDePasse } = req.body;

    try {
        const existingUser = await prisma.utilisateur.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email déjà utilisé." });
        }

        const hashedPassword = await bcrypt.hash(motDePasse, 10);

        const user = await prisma.utilisateur.create({
            data: { nom, email, motDePasse: hashedPassword },
            select: { id: true, nom: true, email: true, type: true } // Exclude password
        });

        res.status(201).json({ message: "Utilisateur créé avec succès", user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

export const login = async (req, res) => {
    const { email, motDePasse } = req.body;

    try {
        const user = await prisma.utilisateur.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        const isPasswordValid = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Mot de passe incorrect" });
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Exclude password and return only needed fields
        const { motDePasse: _, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};