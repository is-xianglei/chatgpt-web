import { isNotEmptyString } from '../utils/is'
import axios from "axios";
import * as console from "console";

const auth = async (req, res, next) => {
	const AUTH_SECRET_KEY = process.env.AUTH_SECRET_KEY
	const VITE_JAVA_API_URL = process.env.VITE_JAVA_API_URL
	if (isNotEmptyString(AUTH_SECRET_KEY)) {
		try {
			const Authorization = req.header('Authorization')
			if (!Authorization){
				throw new Error('Error: 无访问权限 | No access rights')
			}
			const secretKey = Authorization.replace('Bearer ', '').trim();

			const urlUsage = `${VITE_JAVA_API_URL}/openai/verify?code=${secretKey}`
			console.log(urlUsage);
			const response = await axios.post(urlUsage);
			if (response.data.code === '500') {
				throw new Error(response.data.msg)
				// res.write(JSON.stringify({"text": response.data.msg}))
				// res.end()
			}
			next()
		} catch (error) {
			res.send({ status: 'Unauthorized', message: error.message ?? 'Please authenticate.', data: null })
		}
	}
	else {
		next()
	}
}

export { auth }
