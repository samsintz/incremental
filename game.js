var sips = 0;
var money = 100;
var sipStrength = 1; //sips/click
var autoSip; //interval to run autosips
var autoSipRate = 1000; //1 sec
var moneyTick; //interval to subtract money
var moneyTickRate = 1000; //1 sec
var coffeeCost = 1; //$1/sec
var codeTick; //interval to add income from coding
var codeTickRate = 1000; // 1 sec

//references
//table rows
var strawRow = document.getElementById("strawRow");
var wideStrawRow = document.getElementById("wideStrawRow");
var IVRow = document.getElementById("IVRow");
var learnToCodeRow = document.getElementById("learnToCodeRow");
var fasterIVRow = document.getElementById("fasterIVRow");
//buttons
var strawUpgrade = document.getElementById("strawUpgrade");
var wideStrawUpgrade = document.getElementById("wideStrawUpgrade");
var IVUpgrade = document.getElementById("IVUpgrade");
var learnToCodeUpgrade = document.getElementById("learnToCodeUpgrade");
var fasterIVUpgrade = document.getElementById("fasterIVUpgrade");
//other
var moneyText = document.getElementById("money");
var messageIV = document.getElementById("messageIV");
var messageCode = document.getElementById("messageCode");

var upgrades =
    {
        strawUpgrade: {
            upgraded: false,
            cost: 20,
            effect: 1
        },
        wideStrawUpgrade: {
            upgraded: false,
            cost: 40,
            effect: 2
        },
        IVUpgrade: {
            upgraded: false,
            cost: 100,
            effect: 1
        },
        learnToCodeUpgrade: {
            upgraded: false,
            cost: 100,
            effect: 0.5
        },
        fasterIVUpgrade: {
            upgraded: false,
            cost: 150,
            effect: 1
        }
    };

function init() {
    //buttons
    strawUpgrade.disabled = true;
    wideStrawUpgrade.disabled = true;
    IVUpgrade.disabled = true;
    learnToCodeUpgrade.disabled = true;
    fasterIVUpgrade.disabled = true;
    
    //rows
    learnToCodeRow.style.visibility= "hidden";
    fasterIVRow.style.visibility = "hidden";
    
    //other
    moneyText.style.visibility = "hidden";
    messageIV.style.visibility = "hidden";
    messageCode.style.visibility = "hidden";
    
    //start intervals and check for interface changes
    manageIntervals();
}

document.getElementById("sip").onclick = function() {
    sips += sipStrength;
    updateTotalSips();
};

function updateTotalSips() {
    var sipCount = document.getElementById("caffine");
    sipCount.innerHTML = sips;
}

function updateMoney() {
    moneyText.innerHTML = "$" + money;
    
    //make sure money is always positive, or end game
    if(money < 0) {
        alert("You are broke and cannot feed your coffee addiction. :(");   
    }
}

//manage upgrades on button click
strawUpgrade.onclick = function() {
    sipStrength += upgrades.strawUpgrade.effect;
    sips -= upgrades.strawUpgrade.cost;
    updateTotalSips();
    //make the table row disapear to prevent further upgrades
    strawRow.style.display = "none";
};

wideStrawUpgrade.onclick = function () {
    sipStrength += upgrades.wideStrawUpgrade.effect;
    sips -= upgrades.wideStrawUpgrade.cost;
    updateTotalSips();
    
    wideStrawRow.style.display = "none";
};

IVUpgrade.onclick = function () {
    sips -= upgrades.IVUpgrade.cost;
    updateTotalSips();
    IVRow.style.display = "none";
    
    //show money
    moneyText.style.visibility = "visible";
    upgrades.IVUpgrade.upgraded = true;
    
    //show next upgrade
    learnToCodeRow.style.visibility = "visible";
    
    //start autosip
    manageIntervals();
};

learnToCodeUpgrade.onclick = function() {
    sips -= upgrades.learnToCodeUpgrade.cost;
    updateTotalSips();
    learnToCodeRow.style.display = "none";
    
    upgrades.learnToCodeUpgrade.upgraded = true;

    //show next upgrade
    fasterIVRow.style.visibility = "visible";

    //update messages
    manageMessages();
    manageIntervals();
};

fasterIVUpgrade.onclick = function () {
    sips -= upgrades.fasterIVUpgrade.cost;
    updateTotalSips();
    fasterIVRow.style.display = "none";

    upgrades.fasterIVUpgrade.upgraded = true;
    manageIntervals();
};

function manageUpgradeTable() {
    //check if upgrades are avaliable and display them
    if(sips >= upgrades.strawUpgrade.cost) {
         strawUpgrade.disabled = false;  
    } else {
        strawUpgrade.disabled = true;   
    }
    
    if(sips >= upgrades.wideStrawUpgrade.cost) {
        wideStrawUpgrade.disabled = false;   
    } else {
        wideStrawUpgrade.disabled = true;   
    }
    
    if(sips >= upgrades.IVUpgrade.cost) {
        IVUpgrade.disabled = false;   
    } else {
        IVUpgrade.disabled = true;   
    }
    
    if(sips >= upgrades.learnToCodeUpgrade.cost) {
        learnToCodeUpgrade.disabled = false;   
    } else {
        learnToCodeUpgrade.disabled = true;   
    }
    
    if(sips >= upgrades.fasterIVUpgrade.cost) {
        fasterIVUpgrade.disabled = false;
    } else {
        fasterIVUpgrade.disabled = true;
    }

}

function manageMessages() {
    if(upgrades.IVUpgrade.upgraded) {
        messageIV.style.visibility = "visible";   
    }
    
    if(upgrades.learnToCodeUpgrade.upgraded) {
        messageCode.style.visibility = "visible";
    }
}


function manageIntervals() {
    setInterval(function() {
        manageUpgradeTable();
        manageMessages();
    }, 100);
    
    if(upgrades.IVUpgrade.upgraded) {
        clearInterval(autoSip);
        
        autoSip = setInterval(function() {
            if(upgrades.fasterIVUpgrade.upgraded) {
                sips += (upgrades.IVUpgrade.effect + upgrades.fasterIVUpgrade.effect);
            } else {
               sips += upgrades.IVUpgrade.effect;
            }
            updateTotalSips();
        }, autoSipRate);
        
        clearInterval(moneyTick);
        moneyTick = setInterval(function() {
            money -= coffeeCost;
            updateMoney();
        }, moneyTickRate);
    }
    
    if(upgrades.learnToCodeUpgrade.upgraded) {
           clearInterval(codeTick);
        
        codeTick = setInterval(function() {
            money += upgrades.learnToCodeUpgrade.effect;
            updateMoney();
        }, codeTickRate);
    }
}

//to use later if needed
function generateTableRow(description, cost, effect, id) {
    var upgradesTable = document.getElementById("upgradesTable");
    var newRow = upgradesTable.insertRow(1);
    var desc = newRow.insertCell(0);
    var cst = newRow.insertCell(1);
    var effct = newRow.insertCell(2);
    var bttn = document.createElement("button");
    
    var bttnCell = newRow.insertCell(3);
    bttnCell.appendChild(bttn);
    
    bttn.innerHTML = "buy";
    desc.innerHTML = description;
    cst.innerHTML = cost;
    effct.innerHTML = effect;
    //set ids
    newRow.id = id + "Row";
    bttn.id = id;
    
    //add styles
    desc.setAttribute("class", "mdl-data-table__cell--non-numeric");
    bttn.setAttribute("class", "mdl-button mdl-js-button mdl-button--accent");
    
    //set button to disabled by default
    bttn.disabled = true;
}

init();
