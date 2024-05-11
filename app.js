// ====================================================                                    GETTING ELEMENTS
const output = document.querySelector('#output');
const btnContainer = document.querySelector('.btn_container');
const operatorsCommonNodes = document.querySelectorAll(".operator_common");
const operatorsSpecialNodes = document.querySelectorAll(".operator_special");
let allOperators = [];
const operatorsCommonArr = [];
const operatorsSpecialArr = [];
let current = "";
let accumulator = "";
let dotBoolean = true;

// ====================================================                                    GETTING ARRAYS
for (let operator of operatorsCommonNodes) {
    operatorsCommonArr.push(operator.innerHTML);
}
for (let operator of operatorsSpecialNodes) {
    operatorsSpecialArr.push(operator.innerHTML);
}
allOperators = operatorsCommonArr.concat(operatorsSpecialArr);

// ====================================================                                    CHECKERS
const infinityChecker = () => current === "Infinity";

const checkCommonOperator = (sym) => operatorsCommonArr.includes(sym);

const checkSpecialOperator = (sym) => operatorsSpecialArr.includes(sym);

const checkAllOperator = (sym) => allOperators.includes(sym);

const checkNumber = (num) => (num >= 0 && num <= 9);

const checkLastIndex = (str) => {
    if (str[str.length - 1] === "%") {
        return false;
    } else if (isNaN(str[str.length - 1])) {
        return true;
    }
    return false;
};

// ====================================================                                    FUNCTIONS FOR BREVITY
const equality = (elem) => {
    if (elem === "=" || elem === "Enter") {
        if (output.value && !checkLastIndex(output.value)) {
            if (output.value.includes("%") && accumulator) {
                output.value = (current / 100) * accumulator;
            } else if (output.value.includes("%")) {
                output.value = (current / 100);
            }
            output.value = eval(output.value);
            current = output.value;
            accumulator = "";
            if (infinityChecker()) {
                output.value = "E";
                current = "";
                accumulator = "";
            }
        }
    }
};

const del = (elem) => {
    if (elem === "⇦" || elem === "Backspace") {
        output.value = output.value.slice(0, output.value.length - 1);
    }
};

const clear = (elem) => {
    if (elem === "AC" || elem === "Delete") {
        dotBoolean = true;
        output.value = "";
    }
};

const keyWritePow = (elem, key, degree) => {
    if (
        elem === `${ key }` &&
        output.value &&
        output.value !== "0." &&
        !operatorsCommonArr.some(operator => output.value.includes(operator))
    ) {
        output.value = Math.pow(+output.value, degree);
    }
};

const writePercentage = (elem) => {
    if (
        elem === "%" &&
        output.value &&
        output.value !== "0." &&
        !operatorsCommonArr.some(operator => output.value.includes(operator))
    ) {
        if (!output.value.includes("%")) {
            output.value += "%";
        }
    }
};

const writeDot = (elem) => {
    if (
        elem === "±" &&
        output.value &&
        output.value !== "0." &&
        !operatorsCommonArr.some(operator => output.value.endsWith(operator)) &&
        !accumulator
    ) {
        output.value *= -1;
    }
};

const specialOperatorCheckSuccess = (elem) => {
    if (
        elem === "." &&
        output.value[output.value.length - 1] !== "." &&
        output.value &&
        dotBoolean
    ) {
        output.value += ".";
        current = output.value;
        accumulator = "";
        if (current.endsWith(".")) {
            dotBoolean = false;
        }
    }
};

const commonOperatorCheckSuccess = (elem) => {
    if (output.value !== "" && output.value !== "E") {
        if (checkLastIndex(output.value)) {
            output.value = output.value.slice(0, output.value.length - 1) + elem;
        } else if (!checkLastIndex(output.value)) {
            output.value += elem;
            dotBoolean = true;
        }
    }
};

const numberAdd = (elem) => {
    if (current === "" && !checkAllOperator(elem)) {
        current = elem;
        output.value = current;

    } else if (current && !checkAllOperator(elem)) {
        accumulator = current;
        current = elem;
        output.value += current;
    }
};

// ====================================================                                      STARTING EVENT LISTENING FOR CLICKS                                          =================================================================
btnContainer.addEventListener('click', (e) => {

    const target = e.target;
    if (output.value === "") {
        current = "";
        accumulator = "";
    }
    /*  CLEAR  */
    clear(target.innerHTML);
    /*  DELETE */
    del(target.innerHTML);
    /*  EQUAL */
    equality(target.innerHTML);

    /*    CHECKING FOR OPERATORS , AND ADDING THEM   */
    if (checkCommonOperator(target.innerHTML)) {
        commonOperatorCheckSuccess(target.innerHTML);
    }
    if (checkSpecialOperator(target.innerHTML)) {
        specialOperatorCheckSuccess(target.innerHTML);
        keyWritePow(target.innerHTML, "1/x", -1);
        keyWritePow(target.innerHTML, "x^2", 2);
        keyWritePow(target.innerHTML, "√x", 0.5);
        writePercentage(target.innerHTML);
        writeDot(target.innerHTML)
    }

    /*      CHECKING FOR NUMBERS , AND ADDING THEM   */
    if (target !== btnContainer && (checkAllOperator(target.innerHTML) || checkNumber(target.innerHTML))) {
        numberAdd(target.innerHTML);
    }
});


// ====================================================                                      STARTING EVENT LISTENING FOR KEYS                                          =================================================================
document.addEventListener('keydown', (e) => {
    if (output.value === "") {
        current = "";
        accumulator = "";
    }
    /*  CLEAR  */
    clear(e.key);
    /*  DELETE */
    del(e.key);
    /*  EQUAL */
    equality(e.key);

    /*    CHECKING FOR OPERATORS , AND ADDING THEM   */
    if (checkCommonOperator(e.key) || checkCommonOperator("=")) {
        commonOperatorCheckSuccess(e.key);
    }
    if (checkSpecialOperator(e.key)) {
        specialOperatorCheckSuccess(e.key);
    }

    /*      CHECKING FOR NUMBERS , AND ADDING THEM   */
    if (checkAllOperator(e.key) || checkNumber(e.key)) {
        numberAdd(e.key);
    }

});
