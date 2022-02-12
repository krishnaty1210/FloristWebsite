function myUserValidationFunc(){
	      var myEmailVal = document.getElementById("formemail").value;
          var myPasswordValue = document.getElementById("formpassword").value;
          var myConfirmPasswordValue = document.getElementById("formcnfpassword").value;
	      var myPhoneNumVal = document.getElementById("forphone").value;
          //My regex of choice for Phone number is:
          // Valid formats:
          // (123) 456-7890
          // (123)456-7890
          // 123-456-7890
          // 123.456.7890
          // 1234567890
          // +31636363634
          // 075-63546725
          const regexPhoneNum = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
          //My regex of choice for EmailID is:          
          const regexEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          
        
          var myAlertField = document.getElementById('signupalert');
          var mySpanMessageContent = document.getElementById('messageSpan');

          if(!regexEmail.test(myEmailVal .toLowerCase())){
            myAlertField.style.display = 'block';
            mySpanMessageContent.textContent =  "Please enter a valid email-id";
            return false;
          }else if(!regexPhoneNum.test(myPhoneNumVal)){
            myAlertField.style.display = 'block';
            mySpanMessageContent.textContent =  "Please enter a valid Mobile Number";
            return false;
          }else if(myPasswordValue != myConfirmPasswordValue){
            myAlertField.style.display = 'block';
            mySpanMessageContent.textContent =  "Password and Confirm Password didn't match";
            return false;
          }else{
          
          var passwordRegexVals = new Array();
          passwordRegexVals.push("[A-Z]");
          passwordRegexVals.push("[a-z]");
          passwordRegexVals.push("[0-9]");
          passwordRegexVals.push("[$@$!%*#?&]");            
           
           
          var weakPasswordFlag = false;
          
          var myPasswordCounter = 0;
          for (var i = 0; i < passwordRegexVals.length; i++) {
              if (new RegExp(passwordRegexVals[i]).test(myPasswordValue)) {
                  myPasswordCounter++;
              }
          }
          switch (myPasswordCounter) {
              case 0:
              case 1:
              case 2:
                  myAlertField.style.display = 'block';
                  weakPasswordFlag = true;
                  mySpanMessageContent.textContent =  "Password strength : Weak";                  
                  break;
          }
          if(!weakPasswordFlag){
            myAlertField.style.display = 'none';
            mySpanMessageContent.textContent =  "";
          	return true;
          }
          return false;
      }
}