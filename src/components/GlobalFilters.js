import { HStack, Input, Select } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { useAsyncDebounce } from 'react-table'
import { useLocation, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import { setTransactions } from '../redux/reducers/transactions'
import { useDispatch, useSelector } from 'react-redux'

function GlobalFilters({ filter, setFilter }) {
  const [value, setValue] = useState('')
  const { wallet } = useSelector((state) => state.wallet)
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()

  const onChange = useAsyncDebounce((value) => {
    setFilter(value || undefined)
  }, 300)

  const handleCategoryChange = (e) => {
    if (e.target.value) {
      searchParams.set('category', e.target.value)
      setSearchParams(searchParams)
    } else {
      searchParams.delete('category')
      setSearchParams(searchParams)
    }
  }
  const handleTypeChange = (e) => {
    if (e.target.value) {
      searchParams.set('type', e.target.value)
      setSearchParams(searchParams)
    } else {
      searchParams.delete('type')
      setSearchParams(searchParams)
    }
  }

  useEffect(() => {
    if (wallet) {
      axios
        .get(`/api/transactions/${wallet.id}${location.search}`)
        .then((res) => {
          dispatch(setTransactions(res.data))
          console.log('1')
        })
        .catch((err) => console.log(err))
    }
  }, [location.search, dispatch, wallet])

  return (
    <>
      <HStack mb={2}>
        <Input
          placeholder='Buscar por nombre'
          pl={2}
          variant='flushed'
          value={value || ''}
          onChange={(e) => {
            setValue(e.target.value)
            onChange(e.target.value)
          }}
        />
        <Select
          variant='filled'
          placeholder='Seleccione un tipo'
          onChange={handleTypeChange}
        >
          <option value='ingress'>Ingreso</option>
          <option value='egress'>Egreso</option>
        </Select>
        <Select
          variant='filled'
          placeholder='Seleccione una categoria'
          onChange={handleCategoryChange}
        >
          <option value='payment'>Cobros</option>
          <option value='purchase'>Compras</option>
          <option value='services'>Pago servicios</option>
          <option value='transfer'>Transferencia</option>
        </Select>
      </HStack>
    </>
  )
}

export default GlobalFilters
