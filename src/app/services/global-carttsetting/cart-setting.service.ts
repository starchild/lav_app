import { Injectable } from '@angular/core';
import {StorageService} from '../../services/storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class CartSettingService {
  globalSetting : any;
  loggedInUser : any;

  countryList = [
    {id:463, name:"Australia"},
    {id:599, name:"New Zealand"},
    {id:666, name:"USA"},
    {id:486, name:"Canada"},
    {id:521, name:"France"},
    {id:527, name:"Germany"},
    {id:664, name:"England"},
    {id:553, name:"Japan"},
    {id:453, name:"Afghanistan"},
    {id:454, name:"Albania"},
    {id:455, name:"Algeria"},
    {id:456, name:"Angola"},
    {id:457, name:"Anguilla"},
    {id:458, name:"Antigua & Barbuda"},
    {id:459, name:"Argentina"},
    {id:460, name:"Armenia"},
    {id:461, name:"Ascension & St. Helena"},
    {id:462, name:"Austria"},
    {id:464, name:"Azerbaijan"},
    {id:465, name:"Bahamas"},
    {id:466, name:"Bahrain"},
    {id:467, name:"Bangladesh"},
    {id:468, name:"Barbados"},
    {id:469, name:"Belarus"},
    {id:470, name:"Belgium"},
    {id:471, name:"Belize"},
    {id:472, name:"Benin"},
    {id:473, name:"Bermuda"},
    {id:474, name:"Bhutan"},
    {id:475, name:"Bolivia"},
    {id:476, name:"Bosnia-Herzegovina"},
    {id:477, name:"Botswana"},
    {id:478, name:"Brazil"},
    {id:479, name:"British Indian Ocean Terr."},
    {id:480, name:"Brunei Darussalam"},
    {id:481, name:"Bulgaria"},
    {id:482, name:"Burkina Faso"},
    {id:483, name:"Burundi"},
    {id:484, name:"Cambodia"},
    {id:485, name:"Cameroon"},
    {id:487, name:"Cape Verde"},
    {id:488, name:"Caroline Is."},  
    {id:489, name:"Cayman Is."},
    {id:490, name:"Central African Rep."},
    {id:491, name:"Chad"},
    {id:492, name:"Chile"},
    {id:493, name:"China"},
    {id:494, name:"Colombia"},
    {id:495, name:"Comoros"},
    {id:496, name:"Congo"},
    {id:497, name:"Congo Dem. Rep."},
    {id:498, name:"Cook Is."},
    {id:499, name:"Costa Rica"},
    {id:500, name:"Cote d'Ivoire"},
    {id:501, name:"Croatia"},
    {id:502, name:"Cuba"},
    {id:503, name:"Cyprus"},
    {id:504, name:"Czech Republic"},
    {id:505, name:"Denmark"},
    {id:506, name:"Djibouti"},
    {id:507, name:"Dominica"},
    {id:508, name:"Dominican Rep."},
    {id:509, name:"Ecuador"},
    {id:510, name:"East Timor"},
    {id:511, name:"Egypt"},
    {id:512, name:"El Salvador"},
    {id:513, name:"Equatorial Guinea"},
    {id:514, name:"Eritrea"},
    {id:515, name:"Estonia"},
    {id:516, name:"Ethiopia"},
    {id:517, name:"Falkland Is. (Malvinas)"},
    {id:518, name:"Faroe Is."},
    {id:519, name:"Fiji"},
    {id:520, name:"Finland"},
    {id:522, name:"French Guinea"},
    {id:523, name:"French Polynesia"},     
    {id:524, name:"Gabon"},
    {id:525, name:"Gambia"},
    {id:526, name:"Georgia"},
    {id:528, name:"Ghana"},
    {id:529, name:"Gibraltar"},
    {id:530, name:"Greece"},
    {id:531, name:"Greenland"},
    {id:532, name:"Grenada"},
    {id:533, name:"Guadeloupe"},
    {id:534, name:"Guam"},
    {id:535, name:"Guatemala"},
    {id:536, name:"Guinea"},
    {id:537, name:"Guinea-Bissau"},
    {id:538, name:"Guyana"},
    {id:539, name:"Haiti"},
    {id:540, name:"Hawaii"},
    {id:541, name:"Honduras"},
    {id:542, name:"Hong Kong"},
    {id:543, name:"Hungary"},
    {id:544, name:"Iceland"},
    {id:545, name:"India"},
    {id:546, name:"Indonesia"}, 
    {id:547, name:"Iran"},
    {id:548, name:"Iraq"},
    {id:549, name:"Ireland"},
    {id:550, name:"Isreal"},
    {id:551, name:"Italy"},
    {id:552, name:"Jamaica"},
    {id:553, name:"Japan"},
    {id:554, name:"Jordan"},
    {id:555, name:"Kazakhstan"},
    {id:556, name:"556"},
    {id:557, name:"557"},
    {id:558, name:"Korea (north)"},
    {id:559, name:"Korea (South)"},
    {id:560, name:"Kuwait"},
    {id:561, name:"Kyrgyzstan"},
    {id:562, name:"Laos"},
    {id:563, name:"Latvia"},
    {id:564, name:"Lebanon"},
    {id:565, name:"Lesotho"},
    {id:566, name:"Liberia"},
    {id:567, name:"Libyan Arab Jamahiriya"},
    {id:568, name:"Liechtenstein"},
    {id:569, name:"Lithuania"},     
    {id:570, name:"Luxemburg"},
    {id:571, name:"Macao"},
    {id:572, name:"Macedonia"},
    {id:573, name:"Madagascar"},
    {id:574, name:"Malawi"},
    {id:575, name:"Malaysia"},
    {id:576, name:"Maldives"},
    {id:577, name:"Mali"},
    {id:578, name:"Malta"},
    {id:579, name:"Mariana Is."},
    {id:580, name:"Marshall Is."},
    {id:581, name:"Martinique"},
    {id:582, name:"Mauritania"},
    {id:583, name:"Mauritius"},
    {id:584, name:"Mexico"},
    {id:585, name:"Micronesia"},
    {id:586, name:"Moldova"},
    {id:587, name:"Monaco"},
    {id:588, name:"Mongolia"},
    {id:589, name:"Montserrat"},
    {id:590, name:"Morocco"},
    {id:591, name:"Mozambique"},   
    {id:592, name:"Maynmar"},
    {id:593, name:"Namibia"},
    {id:594, name:"Nauru"},
    {id:595, name:"Nepal"},
    {id:596, name:"Netherlands"},
    {id:597, name:"Netherlands Antilles & Aruba"},
    {id:598, name:"New Caledonia"},
    {id:600, name:"Nicaragua"},
    {id:601, name:"Niger"},
    {id:602, name:"Nigeria"},        
    {id:603, name:"Norfolk Is."},
    {id:604, name:"Norway"},
    {id:605, name:"Oman"},
    {id:606, name:"Pakistan"},
    {id:607, name:"Palau"},
    {id:608, name:"Panama"},
    {id:609, name:"Papua New Guinea"},
    {id:600, name:"Nicaragua"},
    {id:610, name:"Paraguay"},
    {id:611, name:"Peru"},       
    {id:612, name:"Philippines"},
    {id:613, name:"Pitcairn Is."},
    {id:614, name:"Poland"},
    {id:615, name:"Portugal"},        
    {id:616, name:"Puerto Rico"},
    {id:617, name:"Qatar"},
    {id:618, name:"Reunion"},
    {id:619, name:"Romania"},
    {id:620, name:"Russia"},
    {id:621, name:"Rwanda"},
    {id:622, name:"St. Christopher & Nevis"},
    {id:623, name:"St. Lucia"},
    {id:624, name:"St.Pierre & Miquelon"},
    {id:625, name:"St. Vincent & the Granadines"},       
    {id:626, name:"Samoa, American"},
    {id:627, name:"Samoa, Western"},
    {id:628, name:"Sao Tome & Princinpe"},       
    {id:629, name:"Saudi Arabia"},
    {id:630, name:"Senegal"},
    {id:631, name:"Seychelles"},
    {id:632, name:"Sierra Leone"},        
    {id:633, name:"Singapore"},
    {id:634, name:"Slovakia"},
    {id:635, name:"Slovenia"},
    {id:636, name:"Solomon Is."},
    {id:637, name:"Somalia"},
    {id:638, name:"South Africa"},
    {id:639, name:"Spain"},
    {id:640, name:"Sri Lanka"},
    {id:641, name:"Sudan"},
    {id:642, name:"Suriname"},    
    {id:643, name:"Swaziland"},
    {id:644, name:"Sweden"},
    {id:645, name:"Switzerland"},
    {id:646, name:"Syria"},
    {id:647, name:"Taiwan"},
    {id:648, name:"Tajikistan"},       
    {id:649, name:"Tanzania"},
    {id:650, name:"Thailand"},
    {id:651, name:"Togo"},       
    {id:652, name:"Tokelau Is."},
    {id:653, name:"Tonga"},
    {id:654, name:"Trindad & Tobago"},
    {id:655, name:"Tristan Da Cunha"},        
    {id:656, name:"Tunisia"},
    {id:657, name:"Turkey"},
    {id:658, name:"Turkmenistan"},
    {id:659, name:"Turks & Caicos Is."},
    {id:660, name:"Tuvalu"},
    {id:661, name:"Uganda"},
    {id:662, name:"Ukraine"},
    {id:663, name:"United Arab Emirates"},
    {id:664, name:"United Kingdom"},
    {id:665, name:"Uruguay"},  
    {id:667, name:"Uzbekistan"},
    {id:668, name:"Vanuatu"},        
    {id:669, name:"Vatican City State"},
    {id:670, name:"Venezuela"},
    {id:671, name:"Vietnam"},
    {id:672, name:"Virgin Is. (UK)"},
    {id:673, name:"Virgin Is. (USA)"},
    {id:674, name:"Wallis & Futuna Is."},
    {id:675, name:"yemen rep."},
    {id:676, name:"Yugoslavia"},
    {id:677, name:"Zambia"},
    {id:678, name:"Zimbabwe"}                       
  ];
  
  states_au = [
    {name: "NSW", value: "NSW"},
    {name: "QLD", value: "QLD"},
    {name: "VIC", value: "VIC"},
    {name: "TAS", value: "TAS"},
    {name: "SA", value: "SA"},
    {name: "WA", value: "WA"},
    {name: "NT", value: "NT"},
    {name: "ACT", value: "ACT"}
  ];

  constructor(
    public storageService: StorageService,
  ) { }

  async setGlobalInfo(cartSettingList){
    console.log("setGlobalInfo");
    this.loggedInUser = await this.storageService.getObject('loginedUser');
    this.globalSetting = this.getGlobalCarttSetting(cartSettingList);
  }

  getGlobalCarttSetting(cartSettingList){
    var minimum_order_state, minimum_order_state_value, minimum_order, amount_alert_threshold, amount_alert_ceiling,amount_alert_pre_text, amount_alert_text, amount_alert_post_text, terms_conditions;

    for( var i=0; i<cartSettingList.length; i++){
      if(cartSettingList[i].variable_name == 'minimum_order_state'){
        console.log(cartSettingList[i])
        minimum_order_state = JSON.parse(cartSettingList[i].variable_value);
      }
      if(cartSettingList[i].variable_name == 'minimum_order'){
        minimum_order = cartSettingList[i].variable_value;
      }    
      if(cartSettingList[i].variable_name == 'cart_amount_alert_threshold'){
        amount_alert_threshold = cartSettingList[i].variable_value;
      }   
      if(cartSettingList[i].variable_name == 'cart_amount_alert_ceiling'){
        amount_alert_ceiling = cartSettingList[i].variable_value;
      }     
      if(cartSettingList[i].variable_name == 'cart_amount_alert_pre_text'){
        amount_alert_pre_text = cartSettingList[i].variable_value;
      }   
      if(cartSettingList[i].variable_name == 'cart_amount_alert_text'){
        amount_alert_text = cartSettingList[i].variable_value;
      }     
      if(cartSettingList[i].variable_name == 'cart_amount_alert_post_text'){
        amount_alert_post_text = cartSettingList[i].variable_value;
      }   
      if(cartSettingList[i].variable_name == 'terms_conditions'){
        terms_conditions = cartSettingList[i].variable_value;
      }                             
    }
    var state = this.loggedInUser.ship_state ? this.loggedInUser.ship_state : this.loggedInUser.state;
    for(var k in minimum_order_state){
      if(k == state)
        minimum_order_state_value = minimum_order_state[k];
    }

    if(!minimum_order_state_value)
      minimum_order_state_value = minimum_order.split(",")[this.loggedInUser.group_id];  

    return {
      minimum_order: minimum_order_state_value,
      amount_alert_threshold: amount_alert_threshold,
      amount_alert_ceiling: amount_alert_ceiling,
      amount_alert_pre_text: amount_alert_pre_text,
      amount_alert_text: amount_alert_text,
      amount_alert_post_text: amount_alert_post_text,
      terms_conditions: terms_conditions
    }
  }
}
