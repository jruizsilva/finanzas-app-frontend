import { Box, Flex, useColorModeValue } from '@chakra-ui/react'

import React from 'react'
import { MyTable, BalanceCard } from './index'

function Main() {
  return (
    <Box
      px={[4, 8, 16]}
      pt={8}
      pb={4}
      minH='90vh'
      bg={useColorModeValue('gray.50', 'gray.800')}
      as='main'
    >
      <Flex direction='column' alignItems='center' rowGap={8}>
        <BalanceCard />
        <MyTable />
      </Flex>
    </Box>
  )
}

export default Main
