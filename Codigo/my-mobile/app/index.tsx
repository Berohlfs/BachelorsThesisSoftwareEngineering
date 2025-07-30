// Expo
import { useRouter } from "expo-router"
import * as SecureStore from 'expo-secure-store'
// RN
import { TextInput, View, Pressable, Text, Alert } from "react-native"
// Libs
import { AnimatedCircularProgress } from 'react-native-circular-progress'
// Components
import { Text as CustomText } from "@/components/Text"
// Assets
import { primary_color } from "@/assets/colors"
// Supabase
import { supabase } from "@/lib/supabase"
// React
import { useEffect, useState } from "react"

export default function Index() {

  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const login = async () => {
    if(!username || !password){
      return Alert.alert('Preencha os campos de "usuário" e "senha".')
    }
    try {
      setLoading(true)
      const res = await supabase
        .from('staff')
        .select(`
          *,
          events (
            *
          )
        `)
        .eq('username', username)
        .eq('password', password)
        .single()

      if (res.data) {
        await SecureStore.setItemAsync('user', JSON.stringify(res.data))
        router.push('/scanner')
      } else {
        Alert.alert('Credenciais inválidas')
      }

    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getUserData = async () => {
    try {
      const userData = await SecureStore.getItemAsync('user')
      if (userData) {
        router.push('/scanner')
      }
    } catch (error) {
      console.error('Error retrieving user data:', error)
    }
  }

  useEffect(()=> {
    getUserData()
  }, [])

  return (
    <View className={'flex-1 justify-center px-5 gap-3 bg-white'}>
      <Text
        style={{ fontFamily: 'Montserrat_800ExtraBold', }}
        className={'text-5xl flex-row text-center mb-6'}>
        <Text>TU</Text><Text style={{ color: primary_color }}>SCAN</Text>
      </Text>

      <CustomText className={'ml-2 text-gray-500 font-medium'}>Usuário</CustomText>
      <TextInput
        autoCapitalize={'none'}
        value={username}
        onChangeText={(value) => setUsername(value)}
        placeholder="Digite o usuário"
        placeholderTextColor="#333"
        style={{ fontFamily: 'Montserrat_400Regular' }}
        className={'bg-slate-100 rounded-md p-5 text-black'} />

      <CustomText className={'ml-2 text-gray-500 font-medium'}>Senha</CustomText>
      <TextInput
        autoCapitalize={'none'}
        secureTextEntry
        placeholderTextColor="#333"
        value={password}
        onChangeText={(value) => setPassword(value)}
        placeholder="Digite o senha"
        style={{ fontFamily: 'Montserrat_400Regular' }}
        className={'bg-slate-100 rounded-md p-5 mb-4 text-black'} />

      <Pressable
        style={{ backgroundColor: primary_color }}
        disabled={loading}
        className={`p-4 rounded-lg flex-row justify-center items-center gap-2`}
        onPress={() => login()}>
        {loading ?
          <AnimatedCircularProgress
            size={20}
            width={4}
            fill={75}
            tintColor="#fff"
            backgroundColor="#bbb"
            duration={2000}
          /> :
          <Text
            style={{ fontFamily: 'Montserrat_800ExtraBold', }}
            className={'text-white text-lg'}>
            Entrar
          </Text>}
      </Pressable>
    </View>
  )
}
