$(function () {
    window.web3Provider;
    async function loadWeb3() {
        if (window.ethereum) {
            window.web3Provider = window.ethereum;
            try {
                // Request account access
                await window.ethereum.enable();
            } catch (error) {
                // User denied account access...
                console.log("failed to connect to window.etherum")
            }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
            try {
                window.web3Provider = window.web3.currentProvider;
            } catch (error) {
                console.log("Failed to connect to web3")

            }
        }
        // If no injected web3 instance is detected, fall back to Ganache
        else {
            alert("None ethereum browser detected! Try installing metamask extension");
        }
        window.web3 = new Web3(window.web3Provider); //new Web3('https://data-seed-prebsc-1-s1.binance.org:8545');
    }

    async function loadContract() {
        abi = [{ "inputs": [{ "internalType": "address", "name": "_freeDai", "type": "address" }, { "internalType": "address", "name": "_freeLake", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }], "name": "fDaiBal", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_address", "type": "address" }], "name": "flkBal", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "freeDai", "outputs": [{ "internalType": "contract FreeDai", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "freeLake", "outputs": [{ "internalType": "contract FreeLake", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "hasStaked", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "history", "outputs": [{ "internalType": "address", "name": "_address", "type": "address" }, { "internalType": "uint256", "name": "_amount", "type": "uint256" }, { "internalType": "string", "name": "_type", "type": "string" }, { "internalType": "uint256", "name": "_date", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "isStaking", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "issueTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_amount", "type": "uint256" }], "name": "stakeTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "stakers", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "", "type": "address" }], "name": "stakingBalance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "txid", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "unstakeTokens", "outputs": [], "stateMutability": "nonpayable", "type": "function" }];
        contractAddress = '0x785B89887c9e2665F937b944A0D17a3D48bb6A17';
        return await new window.web3.eth.Contract(
            abi,
            contractAddress
        )
    }


    // Fetch current user information and update UI
    async function getAccountInfo() {

        // Fetching users data
        yourAddress = window.connected_account; //users address
        window.yourfDai = yourfDai = await window.contract.methods.fDaiBal(window.connected_account).call(); //users freelake balance
        yourFLK = await window.contract.methods.flkBal(window.connected_account).call(); //users freelake balance
        window.stakedfDai = stakedfDai = await window.contract.methods.stakingBalance(window.connected_account).call();


        // Updating the UI
        $('.yourAddress').html(yourAddress);
        $('.yourfDai').html(yourfDai);
        $('.yourFLK').html(yourFLK);
        $('.stakedfDai').html(stakedfDai);
    }

    //staking function
    $(".stakebtn").click(async function () {
        amount = $('.stakeAmount').val();

        if (amount <= 0) {
            $(".error").html("Enter valid amount").show(500);
            await setTimeout(function () {
                $(".error").hide(500);
            }, 5000);

        } else if (Number(amount) > Number(window.yourfDai)) {
            $(".error").html("Insufficient balance").show(500);
            await setTimeout(function () {
                $(".error").hide(500);
            }, 5000);
        }
        else {
            $(".success").html("Processing... Please Wait!").show(500);
            await window.contract.methods.stakeTokens(amount).send({ from: window.connected_account }).then(function (e) {
                if (e) {
                    $(".success").html("Transaction completed Successfully").show(500);
                    loading();
                    setTimeout(function () {
                        $(".success").hide(500);
                    }, 5000);
                }
                else {

                    $(".success").hide();
                    $(".error").html("Transaction failed, make sure you have enough fDAI to stake").show(500);
                }
            });

        }
    });

    // hide error or success on double click
    $(".success,.error").dblclick(function () {
        $('.success, .error').hide();
    });

    // Unstake function
    $(".unstakebtn").click(async function () {

        // amount = $('.stakeAmount').val();

        if (window.stakedfDai <= 0) {
            $(".error").html("There is nothing to unstake").show(500);
            await setTimeout(function () {
                $(".error").hide(500);
            }, 5000);
        } else {

            $(".success").html("Processing... Please Wait!").show(500);
            await window.contract.methods.unstakeTokens().send({ from: window.connected_account }).then(function (e) {
                if (e) {
                    $(".success").html("Transaction Confirmed").show(500);
                    loading();
                    setTimeout(function () {
                        $(".success").hide(500);
                    }, 5000);
                }
                else {
                    $(".success").hide();
                    $(".error").html("Transaction failed").show(500);
                }
            })
        }
    });

    async function fetchHistory() {
        totalHistory = await window.contract.methods.txid().call();
        transactionList = `<div class="col-3">Date</div><div class="col-6">Transaction type</div><div class="col-3">Amount</div>`;
        counter = 0;
        for (var i = totalHistory; i >= 0; i--) {
            currenttxAddress = await window.contract.methods.history(i).call();
            if (window.connected_account == currenttxAddress[0]) {
                counter++;
                // converting date
                let unix_timestamp = currenttxAddress[3];
                // Create a new JavaScript Date object based on the timestamp
                // multiplied by 1000 so that the argument is in milliseconds, not seconds.
                date = new Date(unix_timestamp * 1000);
                //year
                year = date.getFullYear();

                //year
                month = date.getMonth()+1;

                //year
                day = date.getDate();

                // Hours part from the timestamp
                hours = date.getHours();
                // Minutes part from the timestamp
                minutes = "0" + date.getMinutes();
                // Seconds part from the timestamp
                seconds = "0" + date.getSeconds();

                // Will display time in 10:30:23 format
                fullDate = day+"/"+month+"/"+year+" "+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

                if (currenttxAddress[2] == "stake") {
                    Alert = "danger";
                    desc = "Staked fDai tokens";
                    amount = "-" + currenttxAddress[1];
                }
                else if (currenttxAddress[2] == "unstake") {
                    Alert = "dark";
                    desc = "Unstaked fDai tokens";
                    amount = currenttxAddress[1];
                }
                else {
                    Alert = "primary";
                    desc = "Recieved interest";
                    amount = currenttxAddress[1];
                }
                transactionList += `
                            <div class=" alert alert-${Alert} col-3">${fullDate}</div> 
                            <div class=" alert alert-${Alert} col-6">${desc}</div>
                            <div class=" alert alert-${Alert} col-3">${amount} fDAI</div>
                    `
            }
            if(counter==10){
                break;
            }
        }

        $(".tx").html(transactionList);
    }

    async function loading() {
        await loadWeb3();
        window.contract = await loadContract();
        connected_account = await window.web3.eth.getAccounts();
        window.connected_account = connected_account[0];
        getAccountInfo();
        fetchHistory();
        console.log(await window.contract.methods.history(0).call());

    }

    $(".error,.success").hide(); //hide errror
    loading();

})