import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
const config = require('./config');
var SyncClient = require('twilio-sync');
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    team1Phone: "9093031305",
    team2Phone: "9093031308",
    results: {
      team1Name: "Team 1",
      team1Calls: 0,
      team1Score: 65,
      team1SMSScore: 75,
      team2Name: "Team 2",
      team2Calls: 3,
      team2SMSScore: 50,
      team2Score: 80
    }
  },
  mutations: {
      setResults(state,payload){

      let team1 = payload.filter((item) => item.number === '+1' + state.team1Phone);
      let team2 = payload.filter((item) => item.number === '+1' + state.team2Phone);
      state.results.team1Calls = team1.length;
      state.results.team2Calls = team2.length;
      state.results.team1SMSScore = team1.reduce(function (a, b) { return Number(a) + Number(b.score); }, 0);
      state.results.team2SMSScore = team2.reduce(function (a, b) { return Number(a) + Number(b.score); }, 0);
      console.log(state.results);
      }
  },
  actions: {
    loadResults({dispatch,commit,state}){
      axios
        .get("https://jasmine-gull-2964.twil.io/sync-token?key="+config.key)
        .then(function(response){
          console.log(response)
         // var syncClient = new Twilio.Sync.Client(response.data.token, { logLevel: 'info' });
          var syncClient = new SyncClient(response.data.token);
         
          syncClient.list('VETextHack').then(function (list) {
           
            list.getItems().then(function (listData) {
              var respData = listData.items.map(item => item.data.value);
             
              console.log(respData);
              commit('setResults', respData)
             // return callData;
            /* let results ={};
              let team1 = respData.filter((item) => item.number === '+1' + state.team1Phone);
              let team2 = respData.filter((item) => item.number === '+1' + state.team2Phone);
              results.team1calls = team1.length;
              results.team2calls = team2.length;
              results.team1SMSScore = team1.reduce(function(a,b){return Number(a) + Number(b.score);},0);
              results.team2SMSScore = team2.reduce(function (a, b) {return Number(a) + Number(b.score); }, 0);
              console.log(results);*/
            })
        
        
        })
    })

  }
},
getters:{
    team1Phone(state){
      return state.team1Phone;
    },
    team2Phone(state) {
      return state.team2Phone;
    },
    results(state){
      return state.results;
    }
    
}
})
