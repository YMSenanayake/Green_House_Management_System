import React from 'react'
import MainBanner from '../../components/cart/MainBanner'
 import Categories from '../../components/cart/Categories'
 import BestSeller from '../../components/cart/BestSeller'
import BottomBanner from '../../components/cart//BottomBanner'
import NewsLetter from '../../components/cart/NewsLetter'

const Home = () => {
  return (
    <div className='mt-10'>
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner/>
      <NewsLetter />
    </div>
  )
}

export default Home
