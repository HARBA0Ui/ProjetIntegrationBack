import prisma from "../db/prisma.js";
import path from "path";

function detectContentType(mimetype) {
  if (mimetype.startsWith("image/")) return "IMAGE";
  if (mimetype.startsWith("video/")) return "VIDEO";
  if (mimetype === "application/pdf") return "PDF";
  return "LINK";
}

export const createFicheWithUpload = async (req, res) => {
  try {
    const { titre, type, userId, order = 0 } = req.body;
    const file = req.file;

    const fiche = await prisma.fiche.create({
      data: {
        titre,
        type,
        userId,
      },
    });
    if (file) {
      const media = await prisma.media.create({
        data: {
          url: `/uploads/${file.filename}`,
          type: file.mimetype,
        },
      });
      await prisma.ficheContent.create({
        data: {
          ficheId: fiche.id,
          mediaId: media.id,
          order: parseInt(order),
          type: detectContentType(file.mimetype),
        },
      });
    }
    res.status(201).json({ message: "Fiche created successfully", fiche });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getFichesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const fiches = await prisma.fiche.findMany({
      where: { userId },
      include: { contenus: { include: { media: true } } }
    });
    res.status(200).json(fiches);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFicheById = async (req, res) => {
  try {
    const { ficheId } = req.params;
    const fiche = await prisma.fiche.findUnique({
      where: { id: ficheId },
      include: { contenus: { include: { media: true } } }
    });
    if (!fiche) return res.status(404).json({ message: "Fiche not found" });
    res.status(200).json(fiche);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFiche = async (req, res) => {
  try {
    const { ficheId } = req.params;
    const { titre, type } = req.body;
    const fiche = await prisma.fiche.update({
      where: { id: ficheId },
      data: { titre, type }
    });
    res.status(200).json(fiche);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFiche = async (req, res) => {
  try {
    const { ficheId } = req.params;
    await prisma.fiche.delete({
      where: { id: ficheId }
    });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
