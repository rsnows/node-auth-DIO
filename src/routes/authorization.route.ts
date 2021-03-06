import { Router, Request, Response, NextFunction } from 'express';
import ForbiddenError from '../models/errors/forbidden.error.model';
import userRepository from '../repositories/user.repository';
import JWT from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import basicAuthentitcationMiddleware from '../middleware/basic-authentication.middleware';

const authorizationRoute = Router();

authorizationRoute.post('/token', basicAuthentitcationMiddleware, async (req: Request, res: Response, next: NextFunction) => {

	try {
		const user = req.user;

		if (!user) {
			throw new ForbiddenError(`Usuário não informado`);
		}

		const jwtPayload = { username: user.username };
		const jwtOptions = { subject: user?.uuid };
		const secretKey = 'my_secret_key';
		const jwt = JWT.sign(jwtPayload, secretKey, jwtOptions);

		res.status(StatusCodes.OK).json({ token: jwt })
	}
	catch (error) {
		next(error);
	}

});

export default authorizationRoute;