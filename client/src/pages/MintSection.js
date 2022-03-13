import React from 'react';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { grey } from '@mui/material/colors';
import { ethers } from "ethers";
import { useMetaMask } from 'metamask-react';
import Incrementer from '../components/Incrementor';
import { CONTRACT_ABI, CHAIN_ID, NFT_PRICE_WH2, NFT_PRICE_WH1, NFT_PRICE_PUBLIC } from '../utils/constants';
import useAlertMessage from '../hooks/useAlertMessage';
import useWhitelist from '../hooks/useWhitelist';
import useWallet from '../hooks/useWallet';
import api from '../utils/api';

export default function MintSection() {
  const { openAlert } = useAlertMessage();
  const { activeWhitelist } = useWhitelist();
  const { currentAccount } = useWallet();
  const { chainId, ethereum } = useMetaMask();

  const mint = async () => {
    try {
      let transaction = null;
      if (ethereum) {
        if (chainId === CHAIN_ID) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          console.log(process.env.REACT_APP_CONTRACT_ADDRESS);
          // const contract = new ethers.Contract(process.env.REACT_APP_CONTRACT_ADDRESS, CONTRACT_ABI, signer);

          if (activeWhitelist) {
            const hexProof = (await api.post('/whitelist/getHexProof', { address: currentAccount, whitelistId: activeWhitelist.id_whitelist })).data;
            console.log('# hexProof: ', hexProof);

            // //  Whitelist 1
            // if (activeWhitelist.id_whitelist === 1) {
            //   transaction = await contract.privateMint(hexProof, { value: ethers.utils.parseEther(String(NFT_PRICE_WH1)) });
            // } else if (activeWhitelist.id_whitelist === 1) {
            //   //  Whitelist 2
            //   transaction = await contract.privateMint(hexProof, { value: ethers.utils.parseEther(String(NFT_PRICE_WH2)) });
            // }
          } else {
            // transaction = await contract.publicMint({ value: ethers.utils.parseEther(String(NFT_PRICE_PUBLIC)) });
          }
          // await transaction.wait();
          openAlert({ severity: 'success', message: 'Minted!' });
        } else {
          openAlert({ severity: 'warning', message: 'Please choose the correct net.' });
        }
      } else {
        openAlert({ severity: 'error', message: 'Ethereum object doesn\'t exist' });
      }
    } catch (error) {
      openAlert({ severity: 'error', message: error.message ? error.message : 'Transaction is failed.' });
    }
  };

  return (
    <Box mt={{ xl: 10, lg: 10, md: 10, sm: 5, xs: 3 }}>
      <Container maxWidth="lg">
        <Stack spacing={{ xl: 4, lg: 4, md: 4, sm: 2, xs: 2 }}>
          {/* <Typography
            color={grey[100]}
            fontSize={{ xl: 42, lg: 42, md: 36, sm: 32, xs: 24 }}
            fontWeight={700}
            textTransform="uppercase"
            textAlign="center"
          >Mint</Typography> */}
          <Stack direction="row" justifyContent="center" alignItems="center" spacing={5}>
            {/* <Incrementer available={10} /> */}
            <Button
              variant="contained"
              sx={{ borderRadius: 0, fontSize: { xs: 12, sm: 16, md: 20 }, width: 200 }}
              onClick={mint}
            >Mint</Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}