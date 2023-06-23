import React, { useMemo, useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  IconButton,
  Text,
  Center,
  HStack,
  Button,
  useDisclosure
} from '@chakra-ui/react'
import {
  ArrowRightIcon,
  ArrowLeftIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  EditIcon,
  DeleteIcon
} from '@chakra-ui/icons'
import { useDispatch, useSelector } from 'react-redux'
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination
} from 'react-table'
import Swal from 'sweetalert2'
import axios from 'axios'
import { GlobalFilters, ModalForm } from './index'
import { setTransactions } from '../redux/reducers/transactions'
import { setWallet } from '../redux/reducers/wallet'

let pesosARG = Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  useGrouping: true
})

const COLUMNS = [
  {
    Header: 'id',
    accessor: 'id'
  },
  {
    Header: 'Nombre',
    accessor: 'name'
  },
  {
    Header: 'Cantidad',
    accessor: 'amount',
    Cell: ({ value }) => {
      return `${pesosARG.format(value)}`
    }
  },
  {
    Header: 'Tipo',
    accessor: 'type',
    Cell: ({ value }) => {
      if (value === 'egress') return 'Egreso'
      if (value === 'ingress') return 'Ingreso'
      return value
    }
  },
  {
    Header: 'Categoria',
    accessor: 'category',
    Cell: ({ value }) => {
      if (value === 'payment') return 'Cobro'
      if (value === 'purchase') return 'Compras'
      if (value === 'services') return 'Pago servicios'
      if (value === 'transfer') return 'Transferencia'
      return value
    }
  },
  {
    Header: 'Fecha',
    accessor: 'date',
    Cell: ({ value }) => {
      let date = new Date(value)
      date.setDate(date.getDate() + 1)
      return date.toLocaleDateString()
    }
  }
]

function MyTable() {
  const { transactions } = useSelector((state) => state.transaction)
  const { wallet } = useSelector((state) => state.wallet)
  const { user } = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [registerToEdit, setRegisterToEdit] = useState(null)

  const columns = useMemo(() => COLUMNS, [])
  const data = useMemo(() => transactions || [], [transactions])

  const handleDelete = (row) => {
    console.log(row.values.id)
    Swal.fire({
      title: '¿Estas seguro?',
      text: 'No podrás revertir esto!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar el registro'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.delete(
            `/api/transactions/${row.values.id}`
          )
          if (res.data.msg) {
            Swal.fire('Registro borrado!', res.data.msg, 'success')
            axios
              .get(`/api/transactions/${wallet.id}`)
              .then((res) => {
                dispatch(setTransactions(res.data))
              })
              .catch((error) => {
                console.log(error)
              })
            axios
              .get(`/api/wallet/${user.wallet.id}`)
              .then((res) => dispatch(setWallet(res.data)))
              .catch((err) => console.log(err))
          }
        } catch (error) {
          console.log(error)
        }
      }
    })
  }

  const handleEdit = (row) => {
    setRegisterToEdit(row.values)
    onOpen()
  }

  const tableHooks = (hooks) => {
    hooks.visibleColumns.push((columns) => [
      ...columns,
      {
        Cell: ({ row }) => (
          <HStack>
            <Button
              colorScheme='telegram'
              leftIcon={<EditIcon />}
              onClick={() => handleEdit(row)}
            >
              Editar
            </Button>
            <Button
              colorScheme='red'
              leftIcon={<DeleteIcon />}
              onClick={() => handleDelete(row)}
            >
              Eliminar
            </Button>
          </HStack>
        )
      }
    ])
  }

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    nextPage,
    previousPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    gotoPage,
    pageCount,
    prepareRow,
    state,
    setGlobalFilter
  } = useTable(
    {
      columns,
      data
    },
    useGlobalFilter,
    useSortBy,
    usePagination,
    tableHooks
  )
  const { pageIndex, globalFilter } = state

  return (
    <>
      <TableContainer>
        <GlobalFilters
          filter={globalFilter}
          setFilter={setGlobalFilter}
        />
        <Table
          {...getTableProps()}
          variant='striped'
          colorScheme='gray'
          backgroundColor='white'
          borderWidth={1}
          borderRadius='lg'
        >
          <Thead>
            {headerGroups.map((headerGroup) => (
              <Tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column, idx) => (
                  <Th
                    {...column.getHeaderProps(
                      column.getSortByToggleProps()
                    )}
                    bg='gray.600'
                    textColor='white'
                    textAlign={idx === 1 ? 'left' : 'center'}
                  >
                    {column.render('Header')}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? ' ▼'
                          : ' ▲'
                        : ''}
                    </span>
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row)
              return (
                <Tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <Td {...cell.getCellProps()} textAlign='center'>
                        {cell.render('Cell')}
                      </Td>
                    )
                  })}
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
      <Center p={2} w='100%' mt={'-20px'}>
        <Flex
          justifyContent='space-between'
          alignItems='center'
          columnGap={5}
        >
          <Center>
            <IconButton
              size='sm'
              onClick={() => gotoPage(0)}
              isDisabled={!canPreviousPage}
              icon={<ArrowLeftIcon h={3} w={3} />}
            />
          </Center>
          <Center>
            <IconButton
              size='sm'
              onClick={previousPage}
              isDisabled={!canPreviousPage}
              icon={<ChevronLeftIcon h={6} w={6} />}
            />
          </Center>

          <Center>
            <Text flexShrink='0'>
              Page{' '}
              <Text fontWeight='bold' as='span'>
                {pageIndex + 1}
              </Text>{' '}
              of{' '}
              <Text fontWeight='bold' as='span'>
                {pageOptions.length}
              </Text>
            </Text>
          </Center>

          <Center>
            <IconButton
              size='sm'
              onClick={nextPage}
              isDisabled={!canNextPage}
              icon={<ChevronRightIcon h={6} w={6} />}
            />
          </Center>
          <Center>
            <IconButton
              size='sm'
              onClick={() => gotoPage(pageCount - 1)}
              isDisabled={!canNextPage}
              icon={<ArrowRightIcon h={3} w={3} />}
            />
          </Center>
        </Flex>
      </Center>
      {registerToEdit && (
        <ModalForm
          isOpen={isOpen}
          onClose={onClose}
          registerToEdit={registerToEdit}
          setRegisterToEdit={setRegisterToEdit}
        />
      )}
    </>
  )
}

export default MyTable
