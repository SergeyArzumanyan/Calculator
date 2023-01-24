// ====================================================                                    GETTING ELEMENTS
let output = document.querySelector('#output');
let btnContainer = document.querySelector('.btn_container');
let operatorsCommonNodes = document.querySelectorAll(".operator_common");
let operatorsSpecialNodes = document.querySelectorAll(".operator_special");
let allOperators = [];
let operatorsCommonArr = [];
let operatorsSpecialArr = [];
let current = "";
let acumulator = "";
let dotBoolean = true;

// ====================================================                                    GETTING ARRAYS
for ( let operator of operatorsCommonNodes ) {
    operatorsCommonArr.push( operator.innerHTML );
}
for ( let operator of operatorsSpecialNodes ) {
    operatorsSpecialArr.push( operator.innerHTML );
}
allOperators = operatorsCommonArr.concat( operatorsSpecialArr );

// ====================================================                                    CHECKERS
let infinityChecker = () => {
  return current === "Infinity";
}

let checkCommonOperator = ( sym ) => {
  return operatorsCommonArr.includes( sym );
};
let checkSpecialOperator = ( sym ) => {
  return operatorsSpecialArr.includes( sym );
};
let checkAllOperator = ( sym ) => {
  return allOperators.includes( sym );
};
let checkNumber = ( num ) => {
  return ( num >= 0 && num <= 9 );
};

let checkLastIndex = ( str ) => {
  if ( str[str.length - 1] === "%" ) {
    return false;
  } else if ( isNaN( str[str.length - 1] ) ) {
    return true;
  }
    return false;
};

// ====================================================                                    FUNCTIONS FOR BREVITY
let equality = ( elem ) => {
  if ( elem === "=" || elem === "Enter") {
      if ( output.value && !checkLastIndex( output.value ) ) {
        if ( output.value.includes("%") && acumulator ) {
            output.value = (current / 100) * acumulator;
        } else if ( output.value.includes("%") ) {
          output.value = (current / 100);
        }
        output.value = eval( output.value );
        current = output.value;
        acumulator = "";
        if ( infinityChecker() ) {
          output.value = "E";
          current = "";
          acumulator = "";
        }
      }
    }
};

let del = ( elem ) => {
  if ( elem === "⇦" || elem === "Backspace" ) {
    output.value = output.value.slice( 0 , output.value.length - 1 );
  }
};

let clear = ( elem ) => {
  if ( elem === "AC" || elem === "Delete" ) {
    dotBoolean = true;
    output.value = "";
  };
};

let keyWritePow = ( elem  , key , degree ) => {
  if ( elem === `${key}` && output.value && output.value !== "0." && !operatorsCommonArr.some( operator => output.value.includes(operator) ) ) {
    output.value = Math.pow( +output.value , degree );
  }
};

let writePercentage = ( elem ) => {
  if ( elem === "%" && output.value && output.value !== "0." && !operatorsCommonArr.some( operator => output.value.includes(operator) ) ) {
    if ( !output.value.includes("%") ) {
      output.value += "%";
    }
  }
};

let writeDot = ( elem ) => {
  if ( elem === "±" && output.value && output.value !== "0." && !operatorsCommonArr.some( operator => output.value.endsWith(operator) ) && !acumulator ) {
    output.value *= -1;
  }
};

let specialOperatorCheckSuccess = ( elem ) => {
  if ( elem === "." && output.value[output.value.length - 1] !== "."  && output.value && dotBoolean ) {
    output.value += ".";
    current = output.value;
    acumulator = "";
    if ( current.endsWith(".") ) {
      dotBoolean = false;
    }
  }
};

let commonOperatorCheckSuccess = ( elem ) => {
  if ( output.value !== "" && output.value !== "E" ) {
    if ( checkLastIndex( output.value ) ) {
      output.value = output.value.slice( 0 , output.value.length - 1 ) + elem;
    } else if ( !checkLastIndex( output.value ) ) {
      output.value += elem;
      dotBoolean = true;
    }
  }
};

let numberAdd = ( elem ) => {
  if ( current === "" && !checkAllOperator( elem ) ) {
    current = elem;
    output.value = current;

  } else if ( current && !checkAllOperator( elem ) ) {
    acumulator = current;
    current = elem;
    output.value += current;
  }
};

// ====================================================                                      STARTING EVENT LISTENING FOR CLICKS                                          =================================================================
btnContainer.addEventListener( 'click' , ( evn ) => {

  let target = evn.target;
  if ( output.value === "" ) {
    current = "";
    acumulator = "";
  }
/*  CLEAR  */ clear( target.innerHTML );
/*  DELETE */ del( target.innerHTML );
/*  EQUAL */  equality( target.innerHTML );

  /*    CHECKING FOR OPERATORS , AND ADDING THEM   */
  if ( checkCommonOperator( target.innerHTML ) ) {
    commonOperatorCheckSuccess( target.innerHTML );
  }
  if ( checkSpecialOperator( target.innerHTML ) ) {
    specialOperatorCheckSuccess( target.innerHTML );
    keyWritePow( target.innerHTML , "1/x" , -1 );
    keyWritePow( target.innerHTML , "x^2" , 2 );
    keyWritePow( target.innerHTML , "√x" , 0.5 );
    writePercentage( target.innerHTML );
    writeDot( target.innerHTML )
  }

  /*      CHECKING FOR NUMBERS , AND ADDING THEM   */
  if ( target !== btnContainer && (  checkAllOperator( target.innerHTML ) || checkNumber( target.innerHTML ) ) ) {
    numberAdd( target.innerHTML );
  }
});




// ====================================================                                      STARTING EVENT LISTENING FOR KEYS                                          =================================================================
document.addEventListener( 'keydown' , ( evn ) => {
  if ( output.value === "" ) {
    current = "";
    acumulator = "";
  }
/*  CLEAR  */ clear( evn.key );
/*  DELETE */ del( evn.key );
/*  EQUAL */  equality( evn.key );

  /*    CHECKING FOR OPERATORS , AND ADDING THEM   */
  if ( checkCommonOperator( evn.key ) || checkCommonOperator( "=" ) ) {
    commonOperatorCheckSuccess( evn.key );
  }
  if ( checkSpecialOperator( evn.key ) ) {
    specialOperatorCheckSuccess( evn.key );
  }

  /*      CHECKING FOR NUMBERS , AND ADDING THEM   */
  if ( checkAllOperator( evn.key ) || checkNumber( evn.key ) ) {
    numberAdd( evn.key );
  }

});
