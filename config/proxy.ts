import type { ProxyOptions } from 'vite'

export function createViteProxy(isOpenProxy: boolean, viteEnv: ImportMetaEnv) {
  if (!isOpenProxy)
    return

  const proxy: Record<string, string | ProxyOptions> = {
    '/api': {
      target: viteEnv.VITE_APP_API_BASE_URL,
      changeOrigin: true,
      rewrite: path => path.replace('/api/', '/'),
    },
		'/chat': {
			target: viteEnv.VITE_JAVA_API_URL,
			changeOrigin: true,
			rewrite: path => path.replace('/chat/', '/'),
		},
  }

  return proxy
}
