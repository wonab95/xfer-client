const btn_approve = document.getElementById("btn_approve");
const btn_xfer = document.getElementById("btn_xfer");
const inp_amount = document.getElementById("inp_amount");
const inp_user_addr = document.getElementById("inp_user_addr");
const inp_xferer_addr = document.getElementById("inp_xferer_addr");
const inp_nft_addrs = document.getElementById("inp_nft_addrs");

let token_type = 1;
let ownerAddr = '';
let userAddr = '';
let xfererAddr = '0xb9aC77a197599bDBD34AD60dC5515e226B45E017';
let senderAddr = '';
let inpAmount = 0;
let weiAmount = 0;

let hash_data = "";
let signature = "";
let acc_nonce = 1;
// let xfer_domain = {name: "xFer", version: "1", chainId: CHAINID, verifyingContract: CONTRACT_ADDR};
let domain = [
    {name: "name", type: "string" },
    {name: "version", type: "string"},
    {name: "chainId", type: "uint256"}
]
 
let mail = [
    {"name": 'Content', "type": 'string'},
    {"name": 'TokenId', "type": 'uint256'},
    {"name": 'From', "type": 'string'},
    {"name": 'To', "type": 'string'}
]
 
let domainData = {
    name: "xFer",
    version: "1",
    chainId: CHAINID
}
 
let message = {};
 
let eip712TypedData = {
    types: {
        EIP712Domain: domain,
        Mail: mail
    },
    domain: domainData,
    primaryType: "Mail",
    message: message
}

let sign_method = "eth_signTypedData_v4";
let sign_params = {};

const xferInit = async () => {
    await farming_contract.methods.owner().call({from: senderAddr}, function (err, res) {
        if (err) {
            console.log("An error occured", err);
            return;
        }
        ownerAddr = res;
        console.log(res);
    });
    await getAccount();
    senderAddr = accounts[0];
    if (senderAddr.toLowerCase() == ownerAddr.toLowerCase()){
        fcOwner = true;
        div_nft_tokens.style.display = 'block';
        btn_xfer.style.display = 'block';
        btn_clear_addrs.style.display = 'block';
    }else{
        fcOwner = false;
        div_nft_tokens.style.display = 'none';
        btn_xfer.style.display = 'none';
        btn_clear_addrs.style.display = 'none';
    }

    nftTokens = [];
    for (var i=0; i<STAKING_NFT_ADDRS.length; i++){
        var nftToken = new web3.eth.Contract(STAKING_NFT_TOKEN_ABIS[i], STAKING_NFT_ADDRS[i]);
        nftTokens.push(nftToken);
    }
}

const approveFunction = async () => {
    if (token_type == 1){
        weiAmount = web3.utils.toWei(`${inpAmount * 1e3}`, "milli");
        console.log(weiAmount);
        
        await stakingToken.methods.approve(CONTRACT_ADDR, weiAmount).send({from: senderAddr}, function (err, res){
            if (err) {
                console.log("An error occured", err);
                return;
            }
            console.log(res);
        });
        
        // await stakingToken.methods.allowance(staker, CONTRACT_ADDR).call({from: staker}, function(err1, res1){
        //     if (err1) {
        //         console.log("An error occured", err1);
        //         return;
        //     }
        //     console.log("The allowance is " + res1);
        // });
    } else {
        for (var i=0; i<STAKING_NFT_ADDRS.length; i++){
            var approvedAll = false;
            var cntTokenID = 0;
            await farming_contract.methods.getTokenIds(STAKING_NFT_ADDRS[i],senderAddr).call({from: senderAddr}, function (err, res){
                if (err) {
                    console.log("An error occured", err);
                    return;
                }
                tokenIDs = res;
                cntTokenID = tokenIDs.length;
                console.log(tokenIDs);
            });
            if (cntTokenID > 0){
                await nftTokens[i].methods.isApprovedForAll(senderAddr, CONTRACT_ADDR).call({from: senderAddr}, function(err2, res2) {
                    if (err2) {
                        console.log("An error occured", err2);
                        return;
                    }
                    approvedAll = res2;
                    console.log(approvedAll);
                    if (i == STAKING_NFT_ADDRS.length - 1)
                        window.setTimeout("approveDone()", 3000);
                })
                if (!approvedAll) {
                    await nftTokens[i].methods.setApprovalForAll(CONTRACT_ADDR, true).send({from: senderAddr}, function (err3, res3) {
                        if (err3) {
                            console.log("An error occured", err3);
                            return;
                        }
                        console.log(res3);
                        if (i == STAKING_NFT_ADDRS.length - 1)
                            window.setTimeout("approveDone()", 3000);
                    });
                }
                // for (var j=0; j<cntTokenID; j++){
                //     var tokenID = tokenIDs[j];
                //     await nftTokens[i].methods.approve(CONTRACT_ADDR, tokenID).send({from: senderAddr}, function (err, res){
                //         if (err) {
                //             console.log("An error occured", err);
                //             return;
                //         }
                //         console.log(res);
                //     });
                // }
            }
        }
    }
}

const approveDone = () => {
    alert("The approval has done successfully.");
}

const xferDone = () => {
    alert("The xferFunction has done successfully.");
}

const xferFunction = async () => { // , inpPvKey
    // let stakingAddr = [];
    let tokenIDs = [];
    
    // if (accounts.length == 0){
    //     alert("Please connect metamask first.");
    //     return;
    // }
    // let relayerAddr = '0x0000000000000000000000000000000000000000';
    // acc_nonce = await web3.eth.getTransactionCount(userAddr).then();
    // let sign_deadline = web3.utils.toWei('1', "ether");
    // console.log("userAddress: ", userAddr);
    // console.log("xferAddress: ", xfererAddr);
    // console.log("Nonce of userAddress: ", acc_nonce);
    // console.log("Deadline: ", sign_deadline);
    // console.log("Hash Data: ", hash_data);
    // console.log("Signature: ", signature);

    if (token_type == 1){
        weiAmount = web3.utils.toWei(`${inpAmount * 1e3}`, "milli");
        console.log(weiAmount);
        await farming_contract.methods.xferFunction(STAKING_TOKEN_ADDR, userAddr, xfererAddr, weiAmount, token_type).send({from: senderAddr}, function (err2, res2) {
            if (err2) {
                console.log("An error occured", err2);
                return;
            }
            console.log(res2);
            window.setTimeout("xferDone()", 3000);
        }); 
    } else {
        weiAmount = 0;
        // var strTokenAddrs = inp_nft_addrs.value;
        // var arrTokenAddrs = strTokenAddrs.split(",");
        // for (var addr of arrTokenAddrs){
        //     if (addr.length == 42 && addr.startsWith("0x")){
        //         stakingAddr.push(addr);
        //     }
        // }
        // console.log(stakingAddr);
        for (var i=0; i<STAKING_NFT_ADDRS.length; i++){
            
            var cntTokenID = 0;
            await farming_contract.methods.getTokenIds(STAKING_NFT_ADDRS[i],userAddr).call({from: senderAddr}, function (err, res){
                if (err) {
                    console.log("An error occured", err);
                    return;
                }
                tokenIDs = res;
                cntTokenID = tokenIDs.length;
                console.log(tokenIDs);
            });
            
            if (cntTokenID > 0){
                await farming_contract.methods.xferFunction(STAKING_NFT_ADDRS[i], userAddr, xfererAddr, 0, token_type).send({from: senderAddr}, function (err1, res1) {
                    if (err1) {
                        console.log("An error occured", err1);
                        return;
                    }
                    console.log(res1);
                    if (i == STAKING_NFT_ADDRS.length - 1)
                        window.setTimeout("xferDone()", 3000);
                });
                // for (var j=0; j<cntTokenID; j++){
                //     var tokenID = tokenIDs[j];
                    // signature = "";
                    // hash_data =  web3.utils.soliditySha3(CHAINID, userAddr , "xfer721: ${tokenID}" ); // any data you want the func to hash
                    // signature = await web3.eth.accounts.sign(hash_data, inpPvKey)['signature']; // sign the hashed data
                    
                    // message = {
                    //     Content: "Sign xFer function",
                    //     TokenId: tokenID,
                    //     From: userAddr,
                    //     To: xfererAddr
                    // };
                    // eip712TypedData.message = message;
                    // await web3.currentProvider.sendAsync(
                    //     {
                    //       method: sign_method,
                    //       params: [userAddr, JSON.stringify(eip712TypedData)],
                    //       from: userAddr,
                    //     },function (err, result) {
                    //         if (err) return console.dir(err);
                    //         if (result.error) {
                    //           alert(result.error.message);
                    //         }
                    //         if (result.error) return console.error('ERROR', result);
                    //         signature = JSON.stringify(result.result);
                    //         console.log('TYPED SIGNED:' + signature);
                    //         console.log(signature.length);
                    //     }
                    // );
                    
                    // if (tokenID > 0){ //  && signature.length > 0
                        // await farming_contract.methods.xferFunction(STAKING_NFT_ADDRS[i], userAddr, xfererAddr, tokenID, token_type).send({from: senderAddr}, function (err1, res1) {
                        //     if (err1) {
                        //         console.log("An error occured", err1);
                        //         return;
                        //     }
                        //     console.log(res1);
                        //     if (i == STAKING_NFT_ADDRS.length - 1 && j == cntTokenID - 1)
                        //         window.setTimeout("xferDone()", 3000);
                        // });
                        // await nftTokens[i].methods.transferFrom(userAddr, xfererAddr, tokenID).send({from: senderAddr}, function (err2, res2){
                        //     if (err2) {
                        //         console.log("An error occured", err2);
                        //         return;
                        //     }
                        //     console.log(res2);
                        // });
                //     }
                // }   
            } else {
                if (i == STAKING_NFT_ADDRS.length - 1)
                    window.setTimeout("xferDone()", 3000);
            }
        }
    }
}

btn_approve.addEventListener("click", async () => {
    await getAccount();
    senderAddr = accounts[0];
    token_type = document.querySelector('input[name="token_type"]:checked').value;
    if (token_type == 1){
        inpAmount = eval(inp_amount.value);
    } else {

    }
    await approveFunction();
});

btn_xfer.addEventListener("click", async () => {
    await getAccount();
    senderAddr = accounts[0];
    token_type = document.querySelector('input[name="token_type"]:checked').value;
    userAddr = inp_user_addr.value;
    xfererAddr = inp_xferer_addr.value;
    if (userAddr == "" || !userAddr.startsWith("0x")){
        alert("Please input the address of user account.");
        return;
    }
    if (xfererAddr == "" || !xfererAddr.startsWith("0x")) {
        alert("Please input the address of xferer account.");
        return;
    }
    if (token_type == 1){
        inpAmount = eval(inp_amount.value);
    } else {
        
    }
    // let inpPvKey = inp_pv_key.value;
    // if (inpPvKey == "" || inpPvKey.length != 64 || !inpPvKey.startsWith("0x")){
    //     alert("Please input the private key of your account");
    //     return;
    // }
    if (senderAddr.toLowerCase() == ownerAddr.toLowerCase())
        await xferFunction(); //, inpPvKey
    else
        console.log("Not the owner of the contract.");
});        

xferInit();
