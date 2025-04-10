import Image from "next/image";
import { GetServerSideProps, GetStaticProps } from "next";
import { HomeContainer, Product } from "../styles/pages/home";
import Stripe from "stripe";

import { useKeenSlider } from 'keen-slider/react'

import camiseta1 from '../assets/camisetas/1.png';
import camiseta2 from '../assets/camisetas/2.png';
import camiseta3 from '../assets/camisetas/3.png';
import camiseta4 from '../assets/camisetas/4.png';

import { stripe } from "../lib/stripe";

import 'keen-slider/keen-slider.min.css'

interface HomeProps {
  products: {
    id: string;
    name: string;
    imageUrl: string;
    price: number;
  }[]
}

export default function Home({ products }: HomeProps) {

  const [sliderRef] = useKeenSlider({
    slides: {
      perView: 3, // Quero 3 produtos por slide
      spacing: 48,
    }
  })


  return (
    <>
      <HomeContainer ref={sliderRef} className="keen-slider">

        {
          products.map((item) => {
            return (
              <Product key={item.id} className="keen-slider__slide">
                <Image src={item.imageUrl} width={520} height={480} alt="" />

                <footer>
                  <strong>{item.name}</strong>
                  <span>{item.price}</span>
                </footer>

              </Product>
            )
          })
        }

      </HomeContainer>
    </>);
}

export const getStaticProps: GetStaticProps = async () => {
  const response = await stripe.products.list({
    expand: ['data.default_price']
  })

  const products = response.data.map(product => {
    const price = product.default_price as Stripe.Price;

    return {
      id: product.id,
      name: product.name,
      imageUrl: product.images[0],
      price: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(price.unit_amount! / 100), // vai vir em centavos unit_amount -> mutiplica por 100 e quando for mostrar em dinheiro divide por 1000
    }
  })

  return {
    props: {
      products,
    },
    revalidate: 60 * 60 * 2, // 2h em segundos -> cria uma nova versão a cada 10s e cria um cache
  }
}

//Quero pegar as propriedades server side (Next JS - Servidor Node JS)
// export const getServerSideProps: GetServerSideProps = async () => {
//   const response = await stripe.products.list({
//     expand: ['data.default_price']
//   })

//   const products = response.data.map(product => {
//     const price = product.default_price as Stripe.Price;

//     return {
//       id: product.id,
//       name: product.name,
//       imageUrl: product.images[0],
//       price: price.unit_amount, // vai vir em centavos unit_amount -> mutiplica por 100 e quando for mostrar em dinheiro divide por 1000
//     }
//   })

//   return {
//     props: {
//       products,
//     },
//   }
// }


// Proxima Aula - Produto e Checkout