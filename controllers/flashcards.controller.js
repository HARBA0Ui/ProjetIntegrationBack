import prisma from "../db/prisma.js";

export const createSet = async (req, res) => {
  const { title } = req.body;
  try {
    const set = await prisma.flashcardSet.create({
      data: {
        title,
        createdById: req.user.id,
      },
      include: { flashcards: true }
    });
    res.status(201).json(set);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create set', error: error.message });
  }
};

export const getUserSets = async (req, res) => {
  try {
    const sets = await prisma.flashcardSet.findMany({
      where: { createdById: req.user.id },
      include: { 
        _count: { select: { flashcards: true } }, 
        flashcards: { take: 3 } 
      }
    });
    res.json(sets);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch sets' });
  }
};

export const deleteSet = async (req, res) => {
  const { setId } = req.params;
  try {
    
    await prisma.$transaction([
      prisma.flashcard.deleteMany({ where: { setId } }),
      prisma.flashcardSet.delete({ where: { id: setId, createdById: req.user.id } })
    ]);
    res.json({ message: 'Set and cards deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete set' });
  }
};





export const addCardToSet = async (req, res) => {
  const { setId } = req.params;
  const { question, answer } = req.body;
  try {
    const card = await prisma.flashcard.create({
      data: {
        question,
        answer,
        setId,
      },
      include: { set: true } 
    });
    res.status(201).json({message: "card has been created"});
  } catch (error) {
    res.status(500).json({ message: 'Failed to add card' });
  }
};

export const updateCard = async (req, res) => {
  const { cardId } = req.params;
  const { question, answer } = req.body;
  try {
    const card = await prisma.flashcard.update({
      where: { id: cardId },
      data: { question, answer },
      include: { set: { select: { createdById: true } } }
    });

    
    if (card.set.createdById !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.status(201).json({message: "Card has been updated successfully! "})
  } catch (error) {
    res.status(500).json({ message: 'Failed to update card' });
  }
};

export const recordAttempt = async (req, res) => {
  const { cardId } = req.params;
  const { correct } = req.body;
  try {
    
    await prisma.flashcardAttempt.create({
      data: {
        correct,
        userId: req.user.id,
        flashcardId: cardId
      },
      include: { flashcard: true }
    });

    
    const progression = await prisma.progression.upsert({
      where: { userId: req.user.id },
      create: {
        userId: req.user.id,
        totalAttempts: 1,
        correctAnswers: correct ? 1 : 0,
        accuracy: correct ? 100 : 0
      },
      update: {
        totalAttempts: { increment: 1 },
        correctAnswers: { increment: correct ? 1 : 0 },
        lastUpdated: new Date()
      }
    });

    
    const updatedAccuracy = Math.round(
      (progression.correctAnswers / progression.totalAttempts) * 100
    );
    await prisma.progression.update({
      where: { userId: req.user.id },
      data: { accuracy: updatedAccuracy }
    });

    res.json({ accuracy: updatedAccuracy });
  } catch (error) {
    res.status(500).json({ message: 'Failed to record attempt' });
  }
};

export const getSetStatistics = async (req, res) => {
  const { setId } = req.params;

  try {
    const set = await prisma.flashcardSet.findUnique({
      where: { 
        id: setId,
        createdById: req.user.id 
      }
    });

    if (!set) {
      return res.status(404).json({ message: 'Flashcard set not found' });
    }

    const attempts = await prisma.flashcardAttempt.findMany({
      where: {
        flashcard: { setId },
        userId: req.user.id
      },
      select: {
        correct: true
      }
    });

    const totalAttempts = attempts.length;
    const correctAttempts = attempts.filter(a => a.correct).length;
    const accuracy = totalAttempts > 0 
      ? Math.round((correctAttempts / totalAttempts) * 100)
      : 0;

    res.json({
      totalAttempts,
      accuracy
    });

  } catch (error) {
    console.error('Error in getSetStatistics:', error);
    res.status(500).json({ 
      message: 'Failed to fetch stats',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};