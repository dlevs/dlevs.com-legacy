const getEnvValue = (key: string) => {
	const value = process.env[key];

	if (typeof value !== 'string') {
		throw new Error(`Environment variable "${key}" not found`);
	}

	return value;
};

// Export environment variables that we have asserted definitely exist.
export const NODE_ENV = getEnvValue('NODE_ENV');
export const PORT = getEnvValue('PORT');
export const GOOGLE_ANALYTICS_ID = getEnvValue('GOOGLE_ANALYTICS_ID');
export const HOSTNAME = getEnvValue('HOSTNAME');
export const ORIGIN = getEnvValue('ORIGIN');
