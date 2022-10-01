/* eslint-disable */
import type { EthereumProvider, MetaMaskEthereumProvider, Window } from '../types'



  export default detectEthereumProvider

  /**
   * Returns a Promise that resolves to the value of window.ethereum if it is
   * set within the given timeout, or null.
   * The Promise will not reject, but an error will be thrown if invalid options
   * are provided.
   *
   * @param options - Options bag.
   * @param options.mustBeMetaMask - Whether to only look for MetaMask providers.
   * Default: false
   * @param options.silent - Whether to silence console errors. Does not affect
   * thrown errors. Default: false
   * @param options.timeout - Milliseconds to wait for 'ethereum#initialized' to
   * be dispatched. Default: 3000
   * @returns A Promise that resolves with the Provider if it is detected within
   * given timeout, otherwise null.
   */
  function detectEthereumProvider<T = MetaMaskEthereumProvider> ({
    mustBeMetaMask = false,
    timeout = 3000
  } = {}): Promise<EthereumProvider | null> {
 
    return new Promise((resolve) => {
     
      if (typeof window === 'undefined') {
        return resolve(null)
      } else {

        let timeout_;
        let leave = false;
 
        function handleEthereum(){
          
          const w = window as Window
          if(w.ethereum){
              
              clearTimeout(timeout_);
              window.removeEventListener('ethereum#initialized', handleEthereum)
              
              const ethereum = (window as Window).ethereum;
              (!mustBeMetaMask || ethereum.isMetaMask)? 
              resolve(ethereum as unknown as EthereumProvider):resolve(null)

              return;
          } else {


            if(leave) {
              resolve(null);
              window.removeEventListener('ethereum#initialized', handleEthereum)

            }
          }

        }

        // check is is already
        handleEthereum();

        // check if is added
        window.addEventListener('ethereum#initialized', handleEthereum, { once: true }  )


        // wait for timeout
        timeout_ =  setTimeout(() => {
          leave = true;
          handleEthereum()
        }, timeout)
      
 

      }


 
     
    })
 
  }
