"use strict";

import {
EVENT_ACCOUNT_LOGIN,
EVENT_ACCOUNT_REGISTER,
EVENT_ACCOUNT_LOGOUT,
eventBus as eB
} from "../util/eventBus.js"

class AccountView {
 
  onModelEvent(event, data) {
      if (event === EVENT_ACCOUNT_LOGIN) {
          accountLogin(data);
      } else if (event === EVENT_ACCOUNT_REGISTER) {
          accountRegister(data);
      } else if (event === EVENT_ACCOUNT_LOGOUT) {
          accountLogout(data);
      }
  }
  
  accountLogin(data) { // NOT TESTED
      
  }
  
  accountRegister(data) { // NOT TESTED
      
  }
  
  accountLogout(data) { // NOT TESTED
      
  }
}

const accountView = new AccountView();
eB.register(accountView);

