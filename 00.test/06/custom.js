const seasons = [
  {
    name:"spring",
    vars:{
      "--bg-body":"#1b3a2b",
      "--bg-container":"#2e5e3e",
      "--ground":"#4caf50",
      "--tree1":"#2f7d32",
      "--tree2":"#5fa15a",
      "--plant":"#66bb6a"
    }
  },
  {
    name:"summer",
    vars:{
      "--bg-body":"#143d52",
      "--bg-container":"#1e6f8c",
      "--ground":"#66bb6a",
      "--tree1":"#1b8f3a",
      "--tree2":"#4caf50",
      "--plant":"#81c784"
    }
  },
  {
    name:"autumn",
    vars:{
      "--bg-body":"#3a2416",
      "--bg-container":"#5c3b1e",
      "--ground":"#8d6e63",
      "--tree1":"#c75b12",
      "--tree2":"#ff8f00",
      "--plant":"#bcaaa4"
    }
  },
  {
    name:"winter",
    vars:{
      "--bg-body":"#1a2633",
      "--bg-container":"#2f3e4e",
      "--ground":"#b0bec5",
      "--tree1":"#90a4ae",
      "--tree2":"#78909c",
      "--plant":"#cfd8dc"
    }
  }
];

let index = 0;
let timer;

function applySeason(i){
  const root = document.documentElement;
  Object.entries(seasons[i].vars).forEach(([k,v])=>{
    root.style.setProperty(k,v);
  });
}

function nextSeason(){
  index = (index + 1) % seasons.length;
  applySeason(index);
  resetTimer();
}

function prevSeason(){
  index = (index - 1 + seasons.length) % seasons.length;
  applySeason(index);
  resetTimer();
}

function resetTimer(){
  clearInterval(timer);
  timer = setInterval(nextSeason,10000);
}

/* init */
applySeason(index);
timer = setInterval(nextSeason,10000);
