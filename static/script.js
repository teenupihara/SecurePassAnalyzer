const passwordInput =
document.getElementById("password");

const toggleBtn =
document.getElementById("toggle");

const generateBtn =
document.getElementById("generate");

const strength =
document.getElementById("strength");

const score =
document.getElementById("score");

const percent =
document.getElementById("percent");

const progressBar =
document.getElementById("progress-bar");

const sha256 =
document.getElementById("sha256");

const bcryptHash =
document.getElementById("bcrypt");

const crackTime =
document.getElementById("crack-time");

const dictionary =
document.getElementById("dictionary");

const bruteforce =
document.getElementById("bruteforce");

const entropy =
document.getElementById("entropy");

const breach =
document.getElementById("breach");


// =======================
// Live Password Analysis
// =======================

passwordInput.addEventListener(
    "input",
    analyzePassword
);

async function analyzePassword() {

    const password =
        passwordInput.value;

    if(password.length === 0){

        resetUI();
        return;
    }

    const response =
        await fetch("/analyze",{

        method:"POST",

        headers:{
            "Content-Type":
            "application/json"
        },

        body:JSON.stringify({
            password:password
        })

    });

    const data =
        await response.json();

    updateUI(data);
}


// =======================
// Update Interface
// =======================

function updateUI(data){

    let scoreValue =
        data.score;

    let percentage =
        ((scoreValue + 1) / 5)
        * 100;

    percent.innerText =
        Math.round(
            percentage
        ) + "%";

    progressBar.style.width =
        percentage + "%";

    score.innerText =
        "Score: "
        + scoreValue
        + "/4";

    // Strength text

    if(scoreValue === 0){

        strength.innerText =
            "Very Weak";

        progressBar.style.background =
            "#ef4444";

    }

    else if(scoreValue === 1){

        strength.innerText =
            "Weak";

        progressBar.style.background =
            "#f97316";

    }

    else if(scoreValue === 2){

        strength.innerText =
            "Fair";

        progressBar.style.background =
            "#eab308";

    }

    else if(scoreValue === 3){

        strength.innerText =
            "Strong";

        progressBar.style.background =
            "#22c55e";

    }

    else{

        strength.innerText =
            "Very Strong";

        progressBar.style.background =
            "#16a34a";
    }

    // Hashes

    sha256.innerText =
        data.sha256;

    bcryptHash.innerText =
        data.bcrypt;

    // Crack estimates

    crackTime.innerText =
        data.crack_time;

    dictionary.innerText =
        data.dictionary_attack;

    bruteforce.innerText =
        data.bruteforce;

    entropy.innerText =
        data.entropy;

    // Breach Detection

    if(data.breached){

        breach.innerText =
            "⚠ Breached";

        breach.style.color =
            "#ef4444";
    }

    else{

        breach.innerText =
            "✅ Safe";

        breach.style.color =
            "#22c55e";
    }

}


// =======================
// Reset UI
// =======================

function resetUI(){

    percent.innerText =
        "0%";

    progressBar.style.width =
        "0%";

    strength.innerText =
        "Weak";

    score.innerText =
        "Score: 0/4";

    sha256.innerText =
        "-";

    bcryptHash.innerText =
        "-";

    crackTime.innerText =
        "-";

    dictionary.innerText =
        "-";

    bruteforce.innerText =
        "-";

    entropy.innerText =
        "-";

    breach.innerText =
        "✅ Safe";

    breach.style.color =
        "#22c55e";
}


// =======================
// Generate Password
// =======================

generateBtn.addEventListener(
    "click",

    async ()=>{

        const response =
            await fetch(
                "/generate"
            );

        const data =
            await response.json();

        passwordInput.value =
            data.password;

        analyzePassword();

    }
);


// =======================
// Show/Hide Password
// =======================

toggleBtn.addEventListener(
    "click",

    ()=>{

        if(
            passwordInput.type
            === "password"
        ){

            passwordInput.type =
                "text";

            toggleBtn.innerText =
                "🙈";
        }

        else{

            passwordInput.type =
                "password";

            toggleBtn.innerText =
                "👁";
        }

    }
);
