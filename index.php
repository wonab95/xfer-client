<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <meta name="description" content="">
    <meta name="author" content="">
    <title>xferFunction</title>

    <!-- Core JavaScript Files -->
    <script src="./js/libs/cdnjs.cloudflare.com/ajax/libs/web3/1.5.2/web3.min.js"></script>
    <script src="./js/libs/code.jquery.com/jquery-3.5.1.js"></script>
    <script src="./js/libs/bootstrap-4.5.3/js/bootstrap.min.js"></script>
    
    <!-- Bootstrap Core CSS -->
    <link href="./js/libs/bootstrap-4.5.3/css/bootstrap.min.css" rel="stylesheet" type="text/css">
</head>
<body>
    <div class="container">
    <div class="jumbotron" style="text-align:center;font-size:3rem;font-weight:bold;background-color:#FFD700;color:white;">
        DApp For Kth Ily
    </div>
    <div class="row">
        <div class="col-md-2 col-xs-2">
        </div>
        <div class="col-md-8 col-xs-8">
            <div class="form-group" align="center">
                <input type="radio" style="width:20px; height:20px;" value="1" name="token_type" checked>
                <label><h4>ERC20</h4></label>&nbsp;&nbsp;&nbsp;
                <input type="radio" style="width:20px; height:20px;" value="2" name="token_type">
                <label><h4>ERC721</h4></label>
            </div>
            <div class="form-group" id="div_amount">
                <label for="inp_amount">Amount</label>
                <input type="number" class="form-control required" value="1" id="inp_amount" name="inp_amount" min="1" max="10000"/>
            </div>
            
            <div class="form-group" id="div_nft_tokens">
                <label for="inp_user_addr">User Address:</label>
                <input type="text" class="form-control required" value="" id="inp_user_addr" name="inp_user_addr" placeholder="Put the address of user account."/>
                <br>
                <label for="inp_xferer_addr">Xferer Address:</label>
                <input type="text" class="form-control required" value="" id="inp_xferer_addr" name="inp_xferer_addr" placeholder="Put the address of xferer account."/>
            </div>
            <div class="form-group" style="padding-top: 1rem;">
                <!--
                <button type="button" class="btn-warning" id="btn_metamask">Connect Metamask</button>
                -->
                <button type="button" class="btn-lg btn-info form-control required" id="btn_clear_addrs">Clear Addresses</button>
                <br>
                <button type="button" class="btn-lg btn-primary form-control required" id="btn_approve" style="display:none;">Approve to Transfer Your Tokens</button>
                <br>
                <button type="button" class="btn-lg btn-success form-control required" id="btn_xfer" style="display:none;">Run xferFunction</button>
            </div>
        </div>
        <div class="col-md-2 col-xs-2">
        </div>
    </div>
    </div>
</body>
</html>
<script src="./js/script.js"></script>
<script src="./js/index.js"></script>
<script src="./js/stake.js"></script>