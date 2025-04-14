import express, { Request, Response } from 'express';
import { MaterialController } from '../controllers/MaterialController';
import { UserController } from '../controllers/UserController';
import { HistoryController } from "../controllers/HistoryController";
import { AppDataSource } from '../data-source';
import { Material } from '../models/Material';
import { User } from '../models/User';

const router = express.Router();

router.post('/materials', async (req: Request, res: Response) => {
  try {
    const newMaterial = await MaterialController.registerMaterial(req.body);
    res.status(201).json(newMaterial);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(400).json({ error: 'An unknown error occurred' });
    }
  }
});

router.get('/materials', async (req: Request, res: Response) => {
  try {
    const materialRepository = AppDataSource.getRepository(Material);
    const materials = await materialRepository.find();
    res.status(200).json(materials);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los materiales" });
  }
});

router.delete('/materials/:id', (async (req: Request, res: Response) => {
  try {
    const materialRepository = AppDataSource.getRepository(Material);
    const material = await materialRepository.findOneBy({ id: req.params.id });

    if (!material) {
      return res.status(404).json({ error: "Material no encontrado" });
    }

    await materialRepository.remove(material);
    res.status(200).json({ message: "Material eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el material" });
  }
}) as express.RequestHandler);

router.post('/materials/:id/increment', (async (req: Request, res: Response) => {
  try {
    const { amount } = req.body;
    const materialRepository = AppDataSource.getRepository(Material);
    const material = await materialRepository.findOneBy({ id: req.params.id });

    if (!material) {
      return res.status(404).json({ error: "Material no encontrado" });
    }

    material.registeredQuantity += amount;
    material.currentQuantity += amount;

    await materialRepository.save(material);
    res.status(200).json(material);
  } catch (error) {
    res.status(500).json({ error: "Error al incrementar la cantidad" });
  }
}) as express.RequestHandler);

router.post('/users', async (req: Request, res: Response) => {
  try {
    const newUser = await UserController.registerUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
});

router.get('/users', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
});

router.delete('/users/:cedula', async (req: Request, res: Response) => {
  try {
    const { cedula } = req.params;

    // Llamar al controlador para eliminar el usuario
    await UserController.deleteUser(cedula);
    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }
});

router.post('/loans', (async (req: Request, res: Response) => {
  try {
    const { materialId, userId } = req.body;

    if (!materialId || !userId) {
      return res.status(400).json({ error: "Material ID y User ID son requeridos" });
    }

    await MaterialController.registerLoan(materialId, userId);
    res.status(200).json({ message: "Préstamo registrado" });
  } catch (error) {
    handleError(res, error);
  }
}) as express.RequestHandler);

router.post('/returns', (async (req: Request, res: Response) => {
  try {
    const { materialId, userId } = req.body;

    if (!materialId || !userId) {
      return res.status(400).json({ error: "Material ID y User ID son requeridos" });
    }

    await MaterialController.registerReturn(materialId, userId);
    res.status(200).json({ message: "Devolución registrada" });
  } catch (error) {
    handleError(res, error);
  }
}) as express.RequestHandler);

router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await HistoryController.getHistory();
    res.status(200).json(history);
  } catch (error) {
    handleError(res, error);
  }
});

// Función helper para errores
function handleError(res: Response, error: unknown) {
  if (error instanceof Error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export default router;