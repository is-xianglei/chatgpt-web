<script setup lang='ts'>
import { computed, ref } from 'vue'
import { NButton, NInput, NModal, useMessage, NGradientText } from 'naive-ui'
import { fetchVerify } from '@/api'
import { useAuthStore } from '@/store'
import Icon403 from '@/icons/403.vue'
import axios from 'axios'
const kw = import.meta.env.VITE_JAVA_KM_URL

interface Props {
  visible: boolean
}

defineProps<Props>()

const authStore = useAuthStore()

const ms = useMessage()

const loading = ref(false)
const token = ref('')

const disabled = computed(() => !token.value.trim() || loading.value)

async function handleVerify() {
	const secretKey = token.value.trim()

	if (!secretKey)
		return

	try {
		loading.value = true
		const urlUsage = `/chat/openai/verify?code=${secretKey}`
		const response = await axios.post(urlUsage)
		if (response.data.code === '500') {
			ms.error(response.data.msg)
			authStore.removeToken()
			token.value = ''
			return;
		}
		if (response.data.code === '200') {
			ms.success('success')
			authStore.setToken(secretKey)
			// window.location.reload()
		}
	} catch (error: any) {
		ms.error(error.message ?? 'error')
		authStore.removeToken()
		token.value = ''
	} finally {
		loading.value = false
	}
}

function handlePress(event: KeyboardEvent) {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    handleVerify()
  }
}
</script>

<template>
	<NModal :show="visible" style="width: 90%; max-width: 640px">
		<div class="p-10 bg-white rounded dark:bg-slate-800">
			<div class="space-y-4">
				<header class="space-y-2">
					<h2 class="text-2xl font-bold text-center text-slate-800 dark:text-neutral-200">
						Authorization
					</h2>
					<p class="text-base text-center text-slate-500 dark:text-slate-500">
						{{ $t('common.unauthorizedTips') }}
						<NGradientText type="success">
							<a :href="kw" target="_blank"
								 style="text-decoration: none;border: none;outline: none;">前往购买!</a>
						</NGradientText>
					</p>
					<Icon403 class="w-[200px] m-auto"/>
				</header>

				<NInput v-model:value="token" type="password" placeholder="请输入密钥" @keypress="handlePress"/>
				<NButton
					block
					type="primary"
					:disabled="disabled"
					:loading="loading"
					@click="handleVerify"
				>
					{{ $t('common.verify') }}
				</NButton>
			</div>
		</div>
	</NModal>
</template>
