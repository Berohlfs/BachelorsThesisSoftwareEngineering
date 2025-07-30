// Expo
import { CameraView, useCameraPermissions } from "expo-camera"
import * as SecureStore from 'expo-secure-store'
// RN
import { Text, View, Modal, Alert, Pressable, Image } from "react-native"
// React
import { useEffect, useState } from "react"
// Assets
import { primary_color } from "@/assets/colors"
// Components
import { Text as CustomText } from "@/components/Text"
// Libs
import { AnimatedCircularProgress } from "react-native-circular-progress"
// Icons
import Feather from '@expo/vector-icons/Feather'
// Expo
import { useRouter } from "expo-router"
import { LinearGradient } from 'expo-linear-gradient'
// RN
import { ImageBackground } from "react-native"
// Supabase
import { supabase } from "@/lib/supabase"
import { IconRedeemedAnimated } from "@/components/IconRedeemAnimated"

export default function Scanner() {

  const [_, requestPermission] = useCameraPermissions()

  const [QRCodeContent, setQRCodeContent] = useState<string | null>(null)

  const handleOpenCamera = async () => {
    try {
      const { granted } = await requestPermission()
      if (!granted) {
        return Alert.alert('Este aplicativo não tem permissão para usar a camera.')
      }
    } catch (error) {
      console.log(error)
    }
  }

  const router = useRouter()

  const logout = () => {
    Alert.alert('Encerrar esta seção?', 'Será necessário inserir os dados de login novamente.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair', onPress: async () => {
          await SecureStore.deleteItemAsync('user')
          router.push('/')
        }
      },
    ])
  }

  const [user, setUser] = useState<{ full_name: string, events: { name: string, id: number } } | null>(null)

  const getUserData = async () => {
    try {
      const userData = await SecureStore.getItemAsync('user')
      if (userData) {
        const parsedData = JSON.parse(userData)
        setUser(parsedData)
      } else {
        console.log('No user data found.')
      }
    } catch (error) {
      console.error('Error retrieving user data:', error)
    }
  }

  useEffect(() => {
    handleOpenCamera()
    getUserData()
  }, [])

  const [product, setProduct] = useState<{
    name: string,
    image_bucket_ref: string
    price: number
    redeemed_at: Date
  } | null | 'invalid' | 'error'>(null)

  const getProduct = async () => {
    if (QRCodeContent) {
      const { data } = await supabase.from('order_items')
        .select(`
          *,
          orders (
            *
          )
        `)
        .eq('qr_code_token', QRCodeContent || '')
        .single()

      if (data?.orders?.event_id !== Number(user?.events?.id)) {
        return Alert.alert(JSON.stringify('Permissão negada! Item de outro evento.'))
      }

      if (data) {
        if (data?.redeemed_at) {
          setProduct('invalid')
        } else {
          setProduct({
            name: data?.name || '',
            price: data?.price || 0,
            redeemed_at: new Date(data?.redeemed_at || new Date()),
            image_bucket_ref: data?.image_bucket_ref || ''
          })
        }
      } else {
        setProduct('error')
      }
    }
  }

  const [loading_redeem, setLoadingRedeem] = useState(false)

  const [redeemed_notification_on, setRedeemedNotificationOn] = useState<boolean>(false)

  const redeemProduct = async () => {
    setLoadingRedeem(true)
    const { error } = await supabase.from('order_items')
      .update({ redeemed_at: (new Date()).toISOString() })
      .eq('qr_code_token', QRCodeContent || '')
    if (error) {
      setRedeemedNotificationOn(false)
      setProduct('error')
    } else {
      setRedeemedNotificationOn(true)
    }
    setLoadingRedeem(false)
  }

  useEffect(() => {
    setRedeemedNotificationOn(false)
    if (QRCodeContent) {
      getProduct()
    } else {
      setProduct(null)
    }
  }, [QRCodeContent])

  const fallback_image = 'https://trustbpo.com.br/wp-content/uploads/2023/07/empty-1.jpeg'

  return (
    <View className={'bg-white flex-1'}>
      <ImageBackground
        source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3bQhiV9CoO9L6FdFmxBMrPtjnUM4XhtprMA&s' }}
        className={'w-full h-72'}
        resizeMode="cover">
        <LinearGradient
          className={'p-3 px-6'}
          colors={['#0009', 'white']}
          style={{ flex: 1 }}
          locations={[0.4, 1]}>

          <Text
            style={{ fontFamily: 'Montserrat_800ExtraBold', }}
            className={'text-xl flex-row mt-10'}>
            <Text className={'text-white'}>TU</Text>
            <Text style={{ color: primary_color }}>SCAN</Text>
          </Text>

          <View className={'flex-row items-center justify-between py-5'}>
            <Text
              style={{ fontFamily: 'Montserrat_800ExtraBold' }}
              className={'text-4xl text-white'}>
              Bem vindo,
            </Text>
            <Pressable
              style={{ backgroundColor: primary_color }}
              className={'p-2 px-3 items-center rounded-lg'}
              onPress={logout}>
              <Text
                style={{ fontFamily: 'Montserrat_800ExtraBold' }}
                className={'text-md text-white'}>
                Sair
              </Text>
            </Pressable>
          </View>

          <View className={'flex-row items-center gap-3 mb-1'}>
            <Feather name={'user'} size={16} color={'white'} />
            <CustomText
              className={'text-xl text-white'}>
              {user?.full_name || ''}
            </CustomText>
          </View>
          <View className={'flex-row items-center gap-3'}>
            <Feather name={'map-pin'} size={16} color={'white'} />
            <CustomText
              className={'text-lg text-white'}>
              {user?.events.name || ''}
            </CustomText>
          </View>

        </LinearGradient>

      </ImageBackground>

      <View
        className={'mx-auto mt-8 w-[90%] aspect-square overflow-hidden rounded-xl border-2'}
        style={{ borderColor: primary_color }}>
        <CameraView
          onBarcodeScanned={({ data }) => {
            if (data && !QRCodeContent) {
              setTimeout(() => {
                setQRCodeContent(data)
              }, 800)
            }
          }}
          style={{ flex: 1 }}
          facing={'back'} />
      </View>

      <CustomText className={'mt-4 text-center mx-auto w-[70%] text-gray-600'}>
        Mire a camera no QR da ficha, para validar o pedido.
      </CustomText>

      <Modal
        visible={Boolean(QRCodeContent)}
        className={'flex-1'}
        animationType={'slide'}>

        {(typeof product === 'object' && product !== null) ? <>

          <View>
            <IconRedeemedAnimated active={redeemed_notification_on} />
            <Text
              style={{ fontFamily: 'Montserrat_800ExtraBold', }}
              className={'text-2xl text-center mt-5'}>
              {redeemed_notification_on ? 'Retire o pedido' : 'Pedido valido!'}
            </Text>
          </View>

          <View className={'items-center justify-center gap-3 flex-1'}>
            <Image
              source={{ uri: product?.image_bucket_ref ? supabase.storage.from('products').getPublicUrl(product.image_bucket_ref).data.publicUrl : fallback_image }}
              style={{ width: 200, height: 200, borderRadius: 10 }}
              resizeMode="cover"
            />
            <CustomText className={'text-lg mt-2'}>
              {product?.name}
            </CustomText>
          </View>
          {!redeemed_notification_on &&
            <Pressable
              disabled={loading_redeem}
              style={{ backgroundColor: loading_redeem ? 'gray' : 'green' }}
              className={'p-4 items-center rounded-lg m-4 t-0'}
              onPress={redeemProduct}>
              <Text
                style={{ fontFamily: 'Montserrat_800ExtraBold' }}
                className={'text-lg text-white'}>
                {loading_redeem ? 'Confirmando...' : 'Confirmar entrega'}
              </Text>
            </Pressable>}

        </>
          :
          product ?

            <>
              <View>
                <View className={'justify-center items-center h-20 aspect-square bg-red-600 mx-auto mt-20 rounded-full'}>
                  <Feather name="x" size={40} color="white" />
                </View>
                <Text
                  style={{ fontFamily: 'Montserrat_800ExtraBold', }}
                  className={'text-2xl text-center mt-7'}>
                  {product === 'invalid' ? 'Este pedido já foi retirado' : 'Erro ao localizar pedido'}
                </Text>
              </View>

              <CustomText className={'text-lg text-center mt-3 mb-10'}>
                Tente novamente mais tarde
              </CustomText>
            </>

            : <>
              <View className={'flex-1 items-center justify-center'}>
                <AnimatedCircularProgress
                  size={40}
                  width={4}
                  fill={100}
                  tintColor="#e60076"
                  backgroundColor="#e6007644"
                  duration={10000}
                />
              </View>
            </>}

        <Pressable
          className={'p-4 items-center rounded-lg m-4 mt-0'}
          onPress={() => setQRCodeContent(null)}>
          <Text
            style={{ fontFamily: 'Montserrat_800ExtraBold', color: primary_color }}
            className={'text-lg'}>
            {redeemed_notification_on ? 'Fechar' : 'Cancelar'}
          </Text>
        </Pressable>
      </Modal>
    </View>)
}
