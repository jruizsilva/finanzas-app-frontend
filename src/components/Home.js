import { Center, Spinner } from '@chakra-ui/react'
import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Header, Main } from '../components'
import { setWallet } from '../redux/reducers/wallet'

function Home() {
  const { user } = useSelector((state) => state.user)
  const { wallet } = useSelector((state) => state.wallet)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!wallet && user.wallet.id) {
      axios
        .get(`/api/wallet/${user.wallet.id}`)
        .then((res) => dispatch(setWallet(res.data)))
        .catch((err) => console.log(err))
    }
  }, [dispatch, wallet, user])

  return (
    <>
      {!wallet ? (
        <Center h='100vh' bg='gray.50'>
          <Spinner size='xl' />
        </Center>
      ) : (
        <>
          <Header />
          <Main />
        </>
      )}
    </>
  )
}

export default Home
