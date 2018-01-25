//noprotect
document.addEventListener('DOMContentLoaded', appStart)

let screen; // dostęp do ekranu kalkulatora
let comm;
let mem; //memory
let firstNum;
let vall; //plus/minus
let temp;
let bool = false; //usuwanie liczb z ekranu lub nie
let doubleClick = false; // podwójne kliknięcie Equals
let opdblClick = false; // podwójne kliknięcie operanda
let badOp = false; //bramka do niepoprawnych działań
let btnClick = true;
let operacja; // operacja wykonywana (np. dzielenie)
let secondNum; //druga liczba używana do powtarzania działania nią
let scrVal = 0; //wartość z ekranu wczytywana podczas kliknięcia operatora
let button;
let multi; // multiplier

function appStart() {
    screen = document.querySelector("#screen");
    comm = document.querySelector("#comma"); //getting comma btn
    comm.onclick = commaPressed; // adding function to btn

    //cyfry 0-9 i obsługa kliknięcia
    let przyciski = document.querySelectorAll('.cyfra')
    przyciski.forEach(
        function (przycisk) {
            przycisk.addEventListener("click", numberPressed)
        }
    )
    //operatory i obsługa kliknięcia
    let operatory = document.querySelectorAll('.operator')
    operatory.forEach(
        function (przycisk) {
            przycisk.addEventListener('click', operatorPressed)
        }
    )
}


// funkcja do usuwania czarnej obwódki ze znaków pomarańczowych
let style = function () {
    if (operacja != undefined) {
        let ops = document.querySelectorAll('.org') // TUDU
        ops.forEach(
            function (przycisk) {
                przycisk.style.border = "0px";
            }
        )
    }
}

//disabling certain buttons while invalid value is on the screen
let disabling = function () {
    let dis = document.querySelectorAll('.disabler')
    dis.forEach(
        function (ops) {
            ops.disabled = true;
        }
    )
}
//same but enabling
let enabling = function () {
    let dis = document.querySelectorAll('.disabler')
    dis.forEach(
        function (ops) {
            ops.disabled = false;
        }
    )
}

//właściwie funkcja zliczająca ilość cyfr po przecinku
let floatFix = function (s) {
    if (s.includes(',') == true) {
        //  let s = string.toString();
        let s2 = s.substring(s.indexOf(',') + 1);
        let num = s2.length; //liczba miejsce po przecinku (np.3)
        let value = parseFloat(s.replace(',', '.')); //parsowanie stringa na liczbę
        //tworzenie potęgi 10 do usunięcia przecinków z liczb
        multi = 1;
        for (let i = 0; i < num; i++) {
            multi *= 10; //mulitiplier (np. 1000)
        }
        return multi;
    }
    else {
        multi = 1;
        return multi;
    }
}

//z funkcji operandów można by było wyciągnąć jeszcze oddzielną funkcje
let plus = function () {
    if (typeof (mem) == "number")/* mem musi być stringiem przy wejściu do funkcji */ {
        mem = mem.toString();
    }
    else if (typeof (mem) == "string")/*mem musi mieć przecinek, nie kropkę */ {
        if (mem.includes('.') == true) {
            mem = mem.replace('.', ',')
        }
    }
    if (doubleClick == false)/*bo po kolejnym kliknięciu w equals, chcemy dodawać ostatnią liczbę do wyniku, a nie powiększać za każdym razem o ostatni wynik */ {
        secondNum = screen.value; // zapisanie drugiej liczby w zmiennej
    }
    if (typeof (secondNum) == "number") /*musi być stringiem z przecinkiem */ {
        secondNum = secondNum.toString();
        secondNum = secondNum.replace('.', ',')
    }
    doubleClick = true;
    //jesli ma przecinek
    //minusy tłumaczą
    if (mem.includes(',') == true || secondNum.includes(',') == true) {
        let multi1 = floatFix(mem);
        let multi2 = floatFix(secondNum);
        multi = Math.max(multi1, multi2);
        mem = parseFloat(mem.replace(',', '.'));
        secondNum = parseFloat(secondNum.replace(',', '.'));
        mem *= multi;
        secondNum *= multi;
        mem += secondNum;
        mem /= multi;
        temp = mem;
        secondNum /= multi;
    }
    else {
        mem = parseInt(mem)
        secondNum = parseInt(secondNum)
        mem += secondNum
        temp = mem;
    }
}

let minuss = function () {
    if (typeof (mem) == "number") /*plusy tłumaczą */ {
        mem = mem.toString();
        mem = mem.replace('.', ',')
    }
    else if (typeof (mem) == "string") {
        if (mem.includes('.') == true) {
            mem = mem.replace('.', ',')
        }
    }
    if (doubleClick == false) {
        secondNum = screen.value; // zapisanie drugiej liczby w zmiennej
    }
    if (typeof (secondNum) == "number") {
        secondNum = secondNum.toString();
        secondNum = secondNum.replace(',', '.')
    }
    doubleClick = true; //doubleClick bool - podwójne kliknięcie equals zmienia działanie przycisku, więc potrzebna była bramka logiczna 
    // jeśli któraś z liczb posiada przecinek
    if (mem.includes(',') == true || secondNum.includes(',') == true || mem.includes('.') == true || secondNum.includes('.') == true) {
        let multi1 = floatFix(mem); //zapisanie ilości liczb po przecinku
        let multi2 = floatFix(secondNum);//up
        multi = Math.max(multi1, multi2);//użycie większej do mnożenia
        mem = parseFloat(mem.replace(',', '.'));//zmiana na liczbę
        secondNum = parseFloat(secondNum.replace(',', '.'));//zmiana na liczbę
        mem *= multi; // pomnożone, aby pozbyć się przecinka
        secondNum *= multi; // up
        mem -= secondNum; //działanie
        mem /= multi; // podzielone, aby wynik znów był z przecinkiem
        temp = mem; // zapisane, dla działania equalsa
        secondNum /= multi; //żeby można było jej potem używać w dzialaniach normalnie
    }
    else {
        mem = parseInt(mem)
        secondNum = parseInt(secondNum)
        mem -= secondNum
        temp = mem;
    }
}

let multiply = function () {
    if (typeof (mem) == "number") {
        mem = mem.toString();
        mem = mem.replace('.', ',')
    }
    else if (typeof (mem) == "string") {
        if (mem.includes('.') == true) {
            mem = mem.replace('.', ',')
        }
    }
    if (doubleClick == false) {
        secondNum = screen.value; // zapisanie drugiej liczby w zmiennej
    }
    if (typeof (secondNum) == "number") {
        secondNum = secondNum.toString();
        secondNum = secondNum.replace(',', '.')
    }
    //  console.log("secondnumik: " + secondNum +" "+typeof(secondNum))
    // console.log("memik: " + mem + " " + typeof (mem))
    doubleClick = true; //doubleClick bool - podwójne kliknięcie equals zmienia działanie przycisku, więc potrzebna była bramka logiczna 
    // jeśli któraś z liczb posiada przecinek
    if (mem.includes(',') == true || secondNum.includes(',') == true || mem.includes('.') == true || secondNum.includes('.') == true) {
        let multi1 = floatFix(mem); //zapisanie ilości liczb po przecinku
        let multi2 = floatFix(secondNum);//up
        multi = Math.max(multi1, multi2);//użycie większej do mnożenia
        mem = parseFloat(mem.replace(',', '.'));//zmiana na liczbę
        secondNum = parseFloat(secondNum.replace(',', '.'));//zmiana na liczbę
        mem *= multi;
        secondNum *= multi;
        multi *= multi;
        mem *= secondNum;
        mem /= multi;
        temp = mem;
        secondNum /= Math.sqrt(multi);
    }
    else {
        mem = parseInt(mem)
        secondNum = parseInt(secondNum)
        mem *= secondNum
        temp = mem;
    }
}

//wyżej tłumaczy
let divide = function () {
    if (typeof (mem) == "number") {
        mem = mem.toString();
        mem = mem.replace('.', ',')
    }
    else if (typeof (mem) == "string") {
        if (mem.includes('.') == true) {
            mem = mem.replace('.', ',')
        }
    }
    if (doubleClick == false) {
        secondNum = screen.value; // zapisanie drugiej liczby w zmiennej
    }
    if (typeof (secondNum) == "number") {
        secondNum = secondNum.toString();
        secondNum = secondNum.replace(',', '.')
    }
    if (secondNum != "0") {
        doubleClick = true;
        if (mem.includes(',') == true || secondNum.includes(',') == true || mem.includes('.') == true || secondNum.includes('.') == true) {
            let multi1 = floatFix(mem);
            let multi2 = floatFix(secondNum);
            multi = Math.max(multi1, multi2);
            mem = parseFloat(mem.replace(',', '.'));
            secondNum = parseFloat(secondNum.replace(',', '.'));
            mem *= multi;
            secondNum *= multi;
            mem /= secondNum;
            temp = mem;
            secondNum /= multi;
        }
        else {
            mem = parseInt(mem)
            secondNum = parseInt(secondNum)
            mem /= secondNum
            temp = mem;
        }
    }
    else {
        screen.value = "Złe dane wejściowe!";
        badOp = true;
        disabling();
       
    }
}

function commaPressed(e) {
    if (badOp == false) {
        if (screen.value.includes(',') == false)/*jeśli nie ma przecinka, to można dodać*/ {
            screen.value += ','; // dodanie przecinka
            bool = false; //żeby po kliknięciu przecinka, liczby nie usuwały się
        }
    }
}

function numberPressed(e) {
    let przycisk = e.target
    if (screen.value.length < 22)/*jeśli więcej niż 22 liczb na ekranie, nie dopisuje się więcej */ {
        if (operacja == "sqrt") { operacja = ""; } // bo coś się gryzło
        if (bool == false && screen.value != "0") //nie usuwane
        {
            screen.value += przycisk.dataset.val; //dopisywanie cyfr na ekranie
        }
        else /*jeśli mniej */ {
            screen.value = "";
            screen.value += przycisk.dataset.val;
            bool = false; //nie usuwanie liczb z ekranu po naciśnięciu cyfry
            if (doubleClick == true) {
                doubleClick = false;
            }
            if (badOp == true)/*jeśli jest uwaga o złych danych, kliknięcie numeru, anuluje zablokowanie przycisków */ {
                enabling();
                badOp = false; //przy anulacji, ustawiamy bramkę
            }
        }
        btnClick = true;
    }
}

function operatorPressed(e) {
    let przycisk = e.target // ustawianie przycisku na ostatnio używany
    let assign = function () {
        button = przycisk; // przypisuje przycisk do oddzielnej zmiennej, żeby można było potem dojść do jego stylów w switchu equalsa
        button.style.border = "3px solid black"; // zmiana stylu obramowania dla pokazania efektu używania przycisku
        operacja = przycisk.dataset.val; // przypisanie value przycisku, czyli np. "minus" do użycia w switchu equalsa
    }
    //zapisanie cyfry z ekranu (możnaby było się pozbyć)
    scrVal = parseFloat(screen.value.replace(',', '.'))
    bool = true; //usuwanie liczb po naciśnięciu cyfry
    // switch ze względu na value przycvisku
    switch (przycisk.dataset.val) {
        case "sqrt":
            // pierwiastkowanie
            if (screen.value < 0) /* nie można zrobić pierwiastka z liczby ujemnej*/ {
                screen.value = "Złe dane wejściowe";
                badOp = true; //złe dane, ustawienie bramki
                disabling(); //blokowanie przycisków
            }
            else {
                mem = Math.sqrt(scrVal); // pierwiastkowanie
                screen.value = (mem.toString().replace('.', ',')); //wstawienie na ekran i podmiana kropki na przecinek
                operacja = przycisk.dataset.val; //ustawienie value przycisku na operację
            }

            break;
        case "divide":
            if (operacja != undefined) {
                style(); //jeśli jest ustawiona jakaś operacja - (style usuwa obwódki z pomarańczowych przycisków)
            }
            assign(); //ustawianie ostatniego przycisku na aktualnie używaną operację
            if (btnClick == true)/*jeśli przycisk cyfry był użyty(lub pierwszy raz wchodzimy w funkcję (startowe ustawienie bramki = true)) */ {
                if (opdblClick == false) /*podwójne kliknięcie przycisku operacji */ {
                    if (screen.value.endsWith(',') == true) /*jeśli używamy liczby, która kończy się przecinkiem, trzeba go usunąć, aby nie powodował problemów */ {
                        screen.value = screen.value.replace(',', '')
                    }
                    mem = screen.value; //zapisywanie liczby z ekranu do zmiennej pamieci
                    opdblClick = true; //ustawianie bramki podwójnego użycia operandu na true
                }
                else /*jeśli użyto więcej niż raz operandu */ {
                    divide(); //funkcja dzielenia
                    screen.value = (mem.toString().replace('.', ',')); //zapisanie na ekran z przecinkiem, nie kropką
                    bool = true; //usuwanie liczb z ekranu wpisywaniem innych cyfr
                }
                btnClick = false; //ustawienie, że ostatnim klikniętym przyciskiem nie jest cyfra,a operacja
                doubleClick = false; //ustawienie, że equals nie jest już używany więcej niż raz pod rząd (zostało przerwane użyciem tego przycisku)
            }
            break;
        case "multiply":
            //dzielenie tlumaczy
            if (operacja != undefined) {
                style();
            }
            assign();
            if (btnClick == true) {
                if (opdblClick == false) {
                    if (screen.value.endsWith(',') == true) {
                        screen.value = screen.value.replace(',', '')
                    }
                    mem = screen.value;
                    opdblClick = true;
                }
                else {
                    multiply();
                    screen.value = (mem.toString().replace('.', ','));
                    bool = true;
                }
                btnClick = false;
                doubleClick = false;
            }
            break;
        case "minus":
            //dzielenie tłumaczy
            if (operacja != undefined) {
                style();
            }
            assign();
            if (btnClick == true) {
                if (opdblClick == false) {
                    // style();
                    if (screen.value.endsWith(',') == true) {
                        screen.value = screen.value.replace(',', '')
                    }
                    mem = screen.value; //zapisanie do pamięci pierwszej liczby
                    opdblClick = true; // kolejne kliknięcie przycisku operacji powoduje inne zachowanie przycisku
                }
                else {
                    minuss();
                    screen.value = (mem.toString().replace('.', ','));
                    bool = true;
                }
                btnClick = false;
                doubleClick = false;
            }
            break;
        case "plus":
            //dzielenie tłumaczy
            if (operacja != undefined) {
                style();
            }
            assign();
            if (btnClick == true) /*kliknięcie cyfry */ {
                if (opdblClick == false) {
                    // style();
                    if (screen.value.endsWith(',') == true) {
                        screen.value = screen.value.replace(',', '')
                    }
                    mem = screen.value;
                    opdblClick = true;
                }
                else {
                    plus();
                    screen.value = (mem.toString().replace('.', ','));
                    bool = true;
                }
                btnClick = false;
                doubleClick = false;
            }
            break;
        case "plus-minus":
            if (operacja == undefined) //jeśli nie ma przypisanej operacji
            {
                bool = false; // dopisuje cyfry do ekranu; dodane tutaj, aby zniwelować działanie boola na początku funkcji operacji
                // 1. nie jest zerem i nie ma minusa = dodajemy minusa
                if (screen.value != 0 && screen.value.includes(minus) == false) {
                    vall = '-' + scrVal;
                    screen.value = (vall.toString().replace('.', ','));
                }
                //2. nie jest zerem i ma minus = usuwamy
                else if (screen.value != 0 && screen.value.includes('-') == true) {
                    vall = screen.value.replace('-', '');
                    screen.value = (vall.toString().replace('.', ','));
                }
            }
            // gdy operacja  jest przypisana
            else {
                bool = false;// niwelowanie działania boola z początku funkcji
                //1. nie jest zerem i nie ma minusa
                if (screen.value != 0 && screen.value.includes('-') == false) {
                    vall = ',' + scrVal;
                    screen.value = (vall.toString().replace('.', ','));
                }
                else if (screen.value != 0 && screen.value.includes(',') == true) {
                    vall = screen.value.replace('-', '');
                    screen.value = (vall.toString().replace('.', ','));
                }
            }
            break;
        case "sin":
            if (button !== undefined)/*jeśli jest ustawiona jakaś operacja, usuń obwódkę*/ {
                button.style.border = "0px";
            }
            //funkcja utworzona i od razu wywołana
            (vall = function () {
                mem = Math.sin(scrVal); //sinus liczby
                screen.value = (mem.toString().replace('.', ',')); //pokazanie z przecinkiem
            })();
            operacja = przycisk.dataset.val; //ustawienie operacji na sinus
            break;
        case "cos":
            if (button !== undefined) {
                button.style.border = "0px"; //analogicznie jak sinus
            }
            (vall = function () {
                mem = Math.cos(scrVal);
                screen.value = (mem.toString().replace('.', ','));
            })();
            operacja = przycisk.dataset.val;
            break;
        case "tg":
            if (button !== undefined) {
                button.style.border = "0px"; //analogicznie jak sinus
            }
            (vall = function () {
                mem = Math.tan(scrVal);
                screen.value = (mem.toString().replace('.', ','));
            })();
            operacja = przycisk.dataset.val;
            break;
        case "ctg":
            (vall = function () {
                mem = 1 / Math.tan(scrVal); // ctg a = 1/ tg a
                if (mem != Infinity) {
                    screen.value = (mem.toString().replace('.', ',')); //analogicznie jak sinus
                }
                else {
                    screen.value = "Złe dane wejściowe!"; //nie ma ctg z zera
                    badOp = true;
                    disabling();
                }
                if (button !== undefined) {
                    button.style.border = "0px";
                }
            })();
            operacja = przycisk.dataset.val;
            break;
        case "CE": // usuwanie wpisywanej liczby, nie całego działania
            screen.value = "0";
            if (btnClick = true) {
                btnClick = false;
            }
            if (badOp == true)/*żeby tym też można było wrócić do dzialania */ {
                enabling();
                badOp = false;
                if (opdblClick == true) {
                    opdblClick = false;
                }
                if (doubleClick = true) {
                    doubleClick = false;
                }
                btnClick = true;
                screen.value = "0";
                vall = "";
                firstNum = "";
                secondNum = "";
                mem = "";
                scrVal = "";
                if (button != undefined) {
                    button.style.border = "0px";
                }
                operacja = "";
            }
            break;
        case "C":
            if (badOp == true) {
                enabling();
                badOp = false;
            }
            if (opdblClick == true) {
                opdblClick = false;
            }
            if (doubleClick = true) {
                doubleClick = false;
            }
            btnClick = true;
            screen.value = "0";
            vall = "";
            firstNum = "";
            secondNum = "";
            mem = "";
            scrVal = "";
            if (button != undefined) {
                button.style.border = "0px";
            }
            operacja = "";
            break;
        //OPERACJA LICZENIA WYNIKU !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        case "equals":
            if (operacja == undefined || operacja == "")/*nie można użyć, gdy nie ma przydzielonej operacji */ { }
            else {
                switch (operacja) {
                    case "minus":
                        if (doubleClick == false) {
                            minuss();
                        }
                        else {
                            if (opdblClick != true) {
                                minuss();
                            }
                            else {
                                mem -= temp;
                            }
                        }
                        //   screen.value = mem;
                        button.style.border = "0px";
                        screen.value = (mem.toString().replace('.', ','));
                        bool = true;
                        break;
                    case "plus":
                        if (doubleClick == false) {
                            plus();
                        }
                        else /* double Click true */ {
                            if (mem == 0 && secondNum == 0) /*żeby uniknąć na ekranie np. "00000"*/ { }
                            else /*mem i second !=0 */ {
                                if (opdblClick == false)/*operand dbl click */ {
                                    mem += secondNum;
                                    //          console.log("opdblclick true")
                                }
                                else {
                                    if (btnClick == false)/*jeśli liczba nie była kliknęta, używamy do dzialania to, co mamy na ekranie */ {
                                        // mem += temp;
                                        plus();
                                    }
                                    else /*jesli była, do działania używamy ostatniej podanej liczby */ {
                                        mem += secondNum;
                                    }
                                }
                            }
                        }
                        // screen.value = mem;
                        button.style.border = "0px";
                        screen.value = (mem.toString().replace('.', ','));
                        bool = true;
                        break;
                    case "multiply":
                        if (doubleClick == false) {
                            multiply();
                        }
                        else {
                            if (opdblClick == false) {
                                //   mem *= secondNum;
                                multiply();
                            }
                            else {
                                mem *= temp;
                            }
                        }
                        //  screen.value = mem;
                        button.style.border = "0px";
                        screen.value = (mem.toString().replace('.', ','));
                        bool = true;
                        break;
                    case "divide":
                        if (doubleClick == false) {
                            divide();
                        }
                        else {
                            if (opdblClick == false) {
                                //   mem /= secondNum;
                                divide();
                            }
                            else {
                                mem /= temp;
                            }
                        }
                        button.style.border = "0px";
                        if (screen.value.length > 16)/*zaokrągla, żeby cyfry nie wychodziły za ekran */ {
                            let divided = mem.toPrecision(16);
                            screen.value = (divided.replace('.', ','));
                        }
                        else {
                            screen.value = (mem.toString().replace('.', ','));
                        }
                        bool = true;
                        break;
                    case "sqrt": // robi to samo co znak pierwiastka
                        mem = Math.sqrt(mem);
                        screen.value = "";
                        screen.value += (mem.toString().replace('.', ','));
                        break;
                    case "sin":
                        vall();
                        break;
                    case "cos":
                        vall();
                        break;
                    case "tg":
                        vall();
                        break;
                    case "ctg":
                        vall();
                        break;
                }
            }
            opdblClick = false;
            break;
    }
}