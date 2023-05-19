 
const inputslider= document.querySelector("[data-length-slider]");
const display = document.querySelector("[data-passwordDisplay]")
const numdisplay = document.querySelector("[data-length-number]");
const copytext = document.querySelector("[data-copying-msg]");
const copymsgbtn = document.querySelector("[data-copying]")
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numbercheck = document.querySelector("#numbers");
const symbolcheck = document.querySelector("#symbol");
const strengthindicator = document.querySelector("[data-indicator]");
const generatebutton = document.querySelector(".generate-button");
const allcheckbox = document.querySelectorAll("input[type=checkbox]");
const symbols='!"#$%&()*+,-./:;<=>?@[\]^_`{|}~';

//initially

let password="";
let passwordlen=10;
let checkcount=0;
hanldeslider();

//colour of indicator to grey
setIndicator("#ccc");

//sets passwordlength
function hanldeslider()
{
    inputslider.value=passwordlen;
    numdisplay.innerText= passwordlen;  
    
    const min=inputslider.min;
    const max=inputslider.max;
    inputslider.style.backgroundSize=((passwordlen-min)*100/(max-min))+"% 100%"
}

function setIndicator(color){
    strengthindicator.style.backgroundColor=color;
    console.log("colour grey set")
    strengthindicator.style.boxshadow= `0px 0px 12px 1px ${color}`;
    console.log("colour grey set")
}

function getrndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRndNumber()
{
    return getrndInteger(0,9);
}

function generateLowerCase()
{
    return String.fromCharCode(getrndInteger(97,123));
}

function generateUpperCase()
{
    return String.fromCharCode(getrndInteger(65,91));
}
function generateSymbol()
{
    let rndnums=getrndInteger(0,symbols.length);
    return symbols.charAt(rndnums);
}
function calcStrength(){
    let hasUpper= false;
    let haslower= false;
    let hasnum= false;
    let hassymbol= false;
    if(uppercasecheck.checked) hasUpper=true;
    if(lowercasecheck.checked) haslower=true;
    if(numbercheck.checked) hasnum=true;
    if(symbolcheck.checked) hassymbol=true;
    
    if(hasUpper && haslower && (hasnum||hassymbol) && passwordlen>=8){
        setIndicator("#0f0");
    }
    else if((hasUpper||haslower) && (hasnum||hassymbol) && passwordlen>=6)
    {
        setIndicator("#ff0");
    }
    else
    {
        setIndicator("#f00");
    }  

}
async function copyContent()
{
    try{
        await navigator.clipboard.writeText(display.value);
        copytext.innerText="Copied";
    }
    catch(e)
    {
        copytext.innerText="Failed";
    }
    copytext.classList.add("active");
    setTimeout(() => {
        copytext.classList.remove("active");
    }, 2000);
}

function handleCheckboxChange(){
    checkcount=0;
    allcheckbox.forEach((checkbox) =>
    {if(checkbox.checked)
        checkcount++;
    
    if(checkcount>passwordlen)
    {
        passwordlen=checkcount;
        hanldeslider();
    }}
)}

function shufflePassword(array){
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

allcheckbox.forEach( (checkbox) =>{
    checkbox.addEventListener('change', handleCheckboxChange);
})


inputslider.addEventListener('input', (e)=> {
    passwordlen=e.target.value;
    hanldeslider();
})
copymsgbtn.addEventListener('click', ()=>{
    if(display.value){
        copyContent();
    }
})
//event listener and arrow function ?
generatebutton.addEventListener('click',()=>{
    if(checkcount==0)
    return;

    if(passwordlen<checkcount){
        passwordlen=checkcount;
        hanldeslider();
    }
    password="";
    console.log("start"); 

    // if(uppercasecheck.checked)
    // password+=generateUpperCase();
    // if(lowercasecheck.checked)
    // password+=generateLowerCase();
    // if(numbercheck.checked)
    // password+=generateRndNumber();
    // if(symbolcheck.checked)
    // password+=generateSymbol();

    let funarr=[];
    if(uppercasecheck.checked)
    funarr.push(generateUpperCase);
    if(lowercasecheck.checked)
    funarr.push(generateLowerCase);
    if(numbercheck.checked)
    funarr.push(generateRndNumber);
    if(symbolcheck.checked)
    funarr.push(generateSymbol);
    console.log("start2");
    for(let i=0; i<funarr.length;i++)
    {
        password+=funarr[i]();
           
    }
    console.log("start3");
    for(let i=0; i<passwordlen-funarr.length;i++)
    {
        let randIndex=getrndInteger(0,funarr.length);
        password+=funarr[randIndex]();
    }
    console.log("start4");
    password= shufflePassword(Array.from(password));
    display.value=password;
    
    calcStrength();
})