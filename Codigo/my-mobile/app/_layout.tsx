// CSS
import "@/global.css"
// Expo
import { Slot } from "expo-router"
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { Montserrat_400Regular, Montserrat_800ExtraBold } from '@expo-google-fonts/montserrat'
// React
import { useEffect } from 'react'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  const [loaded, error] = useFonts({
    Montserrat_400Regular,
    Montserrat_800ExtraBold
  })

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync()
    }
  }, [loaded, error])

  if (!loaded && !error) {
    return null
  }

  return <Slot/>
}
