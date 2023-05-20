import { useRouter } from 'expo-router'
import { Text, TouchableOpacity, View } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session'
import { useCallback, useEffect } from 'react'

import NlwLogo from '../src/assets/nlw-spacetime-logo.svg'

import { api } from '../src/lib/api'

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint:
    'https://github.com/settings/connections/applications/61f2b85727bbb500a2c9',
}

export default function App() {
  const router = useRouter()

  const [, response, signInWithGithub] = useAuthRequest(
    {
      clientId: '61f2b85727bbb500a2c9',
      scopes: ['identity'],
      redirectUri: makeRedirectUri({
        scheme: 'memories',
      }),
    },
    discovery,
  )

  const handleGithubOAuthCode = useCallback(
    async (code: string) => {
      const response = await api.post('register', {
        code,
      })
      const { token } = response.data

      await SecureStore.setItemAsync('token', token)

      router.push('memories')
    },
    [router],
  )

  useEffect(() => {
    makeRedirectUri({
      scheme: 'memories',
    })
    if (response?.type === 'success') {
      const { code } = response.params

      handleGithubOAuthCode(code)
    }
  }, [response, handleGithubOAuthCode])

  return (
    <View className="flex-1 items-center px-8 py-10">
      <View className="flex-1 items-center justify-center gap-6">
        <NlwLogo />

        <View className="space-y-2">
          <Text className="text-center font-title text-2xl leading-tight text-gray-50">
            Sua cápsula do tempo
          </Text>
          <Text className="text-center font-body text-base leading-relaxed text-gray-100">
            Colecione momentos marcantes da sua jornada e compartilhe (se
            quiser) com o mundo!
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.7}
          className="rounded-full bg-green-500 px-5 py-2"
        >
          <Text
            className="font-alt text-sm uppercase text-black"
            onPress={() => signInWithGithub()}
          >
            Cadastrar lembrança
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="font-b text-center text-sm leading-relaxed text-gray-200">
        Feito com 💜 no NLW da Rocketseat
      </Text>
    </View>
  )
}
