import React, { useState } from 'react'
import Header from '../../src/components/Header/Header'
import ExploreMenu from '../../src/components/ExploreMenu/ExploreMenu'
import ItemDisplay from '../../src/components/ItemDisplay/ItemDisplay'
import './Home.css'

const Home = () => {

  return (
    <div>
      <Header/>
      <ExploreMenu />
      <ItemDisplay />
    </div>
  )
}

export default Home