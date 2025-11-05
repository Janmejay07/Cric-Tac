export default function sitemap() {
	const base = 'https://cric-tac.example.com'
	const routes = ['', '/offline', '/online', '/auth']
	return routes.map((path) => ({
		url: `${base}${path}`,
		lastModified: new Date(),
		changeFrequency: 'weekly' as const,
		priority: path === '' ? 1 : 0.7,
	}))
}
