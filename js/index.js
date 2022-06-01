const btn_metamask = document.getElementById("btn_metamask");
const btn_clear_addrs = document.getElementById("btn_clear_addrs");
var rd_token_type = document.getElementsByName("token_type");
var div_amount = document.getElementById("div_amount");
var div_nft_tokens = document.getElementById("div_nft_tokens");

for (var i=0; i<rd_token_type.length; i++){
    rd_token_type[i].addEventListener("click", (e) =>{
        if (e.target.value == 1){
            div_amount.style.display = "block";
            if (fcOwner == true)
                div_nft_tokens.style.display = "block";
            else
                div_nft_tokens.style.display = "none";
        } else {
            div_amount.style.display = "none";
            if (fcOwner == true)
                div_nft_tokens.style.display = "block";
            else
                div_nft_tokens.style.display = "none";
        }
    });
}

const getAccount = async () => {    
    accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    //console.log(window.ethereum.chainId);
    if (window.ethereum.chainId == "0x4") 
        console.log("Already connected to Rinkeby testnet...");
    else {
        try {
            await ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: '0x4' }],
            });
        } catch (switchError) {
            console.log(switchError);
        }
    }
    console.log(accounts);

};

const addTokenToWallet = async (tokenSymbol, tokenAddress) => {
    let tokenImage;

    if (tokenSymbol == SYM_STAKING)
        tokenImage = SOUR_IMG;
    if (tokenSymbol == SYM_REWARDS)
        tokenImage = BLOCKS_IMG;

    if (window.ethereum) {
        try {
            await window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: tokenAddress,
                        symbol: tokenSymbol,
                        decimals: TOKEN_DECIMALS,
                        image: tokenImage,
                    },
                },
            });
        } catch (error) {
            console.log(error);
        }
    }
};

/*
btn_metamask.addEventListener("click", async () => {
    await getAccount();
    // await addTokenToWallet(SYM_STAKING, STAKING_TOKEN_ADDR);
});
*/

btn_clear_addrs.addEventListener("click", async () => {
    inp_user_addr.value = "";
    inp_xferer_addr.value = "";
});
