// Next
import Link from "next/link"
import Image from "next/image"
// Shadcn
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
// Icons
import { Handshake, Rocket, Store } from "lucide-react"
// Components
import { ModeToggle } from "./components/mode-toggle"
import { ResponsiveNavBar } from "./components/ResponsiveNavBar"
import { GoogleProviderLoginButton } from "./components/GoogleProviderLoginButton"

export default function Home() {
  return (<>
    <nav className={'flex p-4 justify-between items-center relative'}>
      <div className={'absolute bg-primary hidden lg:block top-[-100px] left-20 lg:left-40 xl:left-80 h-[800px] w-48 rotate-25 -z-10 opacity-50'}></div>
      <h1 className={'font-extrabold text-xl'}>TU<span className={'text-primary'}>SCAN</span></h1>
      <div className={'flex items-center gap-2'}>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant={'link'}>
              Login
            </Button>
          </DialogTrigger>
          <DialogContent className={'w-96'}>
            <DialogTitle>
              Acesse sua conta
            </DialogTitle>
            <div className={'flex flex-col items-center'}>
              <Tabs defaultValue="organizador" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="organizador" className={'cursor-pointer'}>
                    Organizador
                  </TabsTrigger>
                  <TabsTrigger value="consumidor" className={'cursor-pointer'}>
                    Consumidor
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="consumidor" className={'flex justify-center'}>
                  <GoogleProviderLoginButton />
                </TabsContent>

                <TabsContent value="organizador" className={'flex justify-center'}>
                  <Button asChild variant={'outline'} className={'mt-3 w-full'} size={'lg'}>
                    <Link href={'/login'}>
                      Acessar como organizador
                      <Store />
                    </Link>
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </DialogContent>
        </Dialog>

        <ResponsiveNavBar nav_array={[{ route: '/register', label: 'Abrir conta de organizador', Icon: <Handshake /> }]} />

        <ul className={'gap-4 text-sm hidden sm:flex mr-4'}>
          <Link href={'/register'}>
            <li className={'hover:underline'}>
              Abrir conta de organizador
            </li>
          </Link>
        </ul>

        <ModeToggle />
      </div>
    </nav>

    <header className={'flex items-center justify-center gap-10 mt-10 lg:mt-0'}>

      <Image
        className={'hidden lg:block'}
        src={'/header-photo.png'}
        width={400}
        height={400}
        alt={'Mobile preview'} />

      <div className={'flex flex-col gap-2 max-w-[490px] text-center lg:text-left px-4'}>
        <h2 className={'font-extrabold text-4xl/12 sm:text-7xl/22'}>Seu pedido,<br />sem filas.</h2>
        <p className={'font-bold text-sm sm:text-lg'}>Eventos mais rápidos. Vendas mais simples.</p>
        <p className={'text-muted-foreground text-xs sm:text-sm max-w-96 sm:w-full'}>
          O Tuscan conecta organizadores de eventos, consumidores e funcionários com uma solução rápida e digital: pedidos pelo celular, validação por QR Code e gestão em tempo real.
        </p>

        <div className={'mt-3 flex justify-center lg:justify-start'}>
          <Button size={'lg'} className={'w-72'} asChild>
            <Link href={'/register'}>
              Começar
              <Rocket />
            </Link>
          </Button>
        </div>

      </div>
    </header>

    <div className={'bg-primary h-1 hidden lg:block'} />

    <footer className={'bg-background flex gap-10 justify-center p-10 items-center flex-wrap flex-col sm:flex-row'}>
      <h1 className={'font-extrabold text-4xl'}>
        TU<span className={'text-primary'}>SCAN</span>
      </h1>
      <div className={'flex flex-col sm:flex-row gap-5 text-center sm:text-left'}>
        <div>
          <h3 className={'font-bold text-sm mb-2'}>Contanto</h3>
          <ul>
            <li>Instagram</li>
            <li>suporte@tuscan.com.br</li>
            <li>+55 (31) 3333-3333</li>
          </ul>
        </div>
        <div>
          <h3 className={'font-bold text-sm mb-2'}>Endereço</h3>
          <ul>
            <li><address>R. Cláudio Manoel, 1162</address></li>
            <li><address>Savassi, Belo Horizonte - MG</address></li>
            <li><address>30140-100</address></li>
          </ul>
        </div>
        <div>
          <h3 className={'font-bold text-sm mb-2'}>Explorar</h3>
          <ul>
            <Link href={'/register'}>
              <li>Abra uma conta de organizador</li>
            </Link>
          </ul>
        </div>
      </div>
    </footer>
  </>)
}

