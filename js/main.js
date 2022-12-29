let app = new Vue({
  el: ".main",
  data: {
    showMain: true,
    showSocial: false,
    showAchievements: false,
    showQuestions: false,
    showResult: false,
    number: 0,
    score: {
      zerg: 0,
      primal: 0,
      protoss: 0,
      taldarim: 0,
      terran: 0,
    },
    totalGames: localStorage.getItem("sc2TotalGames")
      ? JSON.parse(localStorage.getItem("sc2TotalGames"))
      : {
          zerg: 0,
          primal: 0,
          protoss: 0,
          taldarim: 0,
          terran: 0,
          infested: 0,
          hybrid: 0,
        },
    totalGamesNumber: localStorage.getItem("sc2TotalGamesNumber")
      ? localStorage.getItem("sc2TotalGamesNumber")
      : 0,
    questions: questions,
    results: results,
    resultRace: "infested",
  },
  methods: {
    goToMain() {
      this.showMain = true;
      this.showSocial = false;
      this.showAchievements = false;
      this.showQuestions = false;
      this.showResult = false;
    },
    goToSocial() {
      this.showMain = false;
      this.showSocial = true;
      this.showAchievements = false;
      this.showQuestions = false;
      this.showResult = false;
    },
    goToAchievements() {
      if (this.totalGamesNumber > 0) {
        this.showMain = false;
        this.showSocial = false;
        this.showAchievements = true;
        this.showQuestions = false;
        this.showResult = false;
      } else {
        this.goToQuestions();
      }
    },
    goToQuestions() {
      this.score = {
        zerg: 0,
        primal: 0,
        protoss: 0,
        taldarim: 0,
        terran: 0,
      };
      this.showMain = false;
      this.showSocial = false;
      this.showAchievements = false;
      this.showQuestions = true;
      this.showResult = false;
    },
    goToResults(race) {
      this.showMain = false;
      this.showSocial = false;
      this.showAchievements = false;
      this.showQuestions = false;
      this.showResult = true;

      this.resultRace = race;
    },
    nextQuestions(answer) {
      console.log("nextQuestions");
      if (this.number == 24) {
        this.number = 0;
        this.endGame();
      } else {
        this.number++;
      }
      eval(answer);
    },
    endGame() {
      this.totalGamesNumber++;
      localStorage.setItem("sc2TotalGamesNumber", this.totalGamesNumber);
      // Зерг
      if (
        this.score.zerg > this.score.protoss &&
        this.score.zerg > this.score.terran &&
        this.score.primal < 8 &&
        Math.abs(this.score.protoss - this.score.zerg) > 3
      ) {
        this.goToResults("zerg");
        this.totalGames.zerg++;
      }
      // Изначальный
      else if (
        this.score.primal > this.score.protoss &&
        this.score.primal > this.score.terran &&
        this.score.primal == 8
      ) {
        this.goToResults("primal");
        this.totalGames.primal++;
      }
      // Протосс
      else if (
        this.score.protoss > this.score.zerg &&
        this.score.protoss > this.score.terran &&
        this.score.taldarim < 5 &&
        Math.abs(this.score.protoss - this.score.zerg) > 3
      ) {
        this.goToResults("protoss");
        this.totalGames.protoss++;
      }
      // Талдарим
      else if (
        this.score.protoss > this.score.zerg &&
        this.score.protoss > this.score.terran &&
        this.score.taldarim == 5
      ) {
        this.goToResults("taldarim");
        this.totalGames.taldarim++;
      }
      // Терран
      else if (
        this.score.terran > this.score.zerg &&
        this.score.terran > this.score.protoss
      ) {
        this.goToResults("terran");
        this.totalGames.terran++;
      }
      // Гибрид
      else if (Math.abs(this.score.protoss - this.score.zerg) <= 3) {
        this.goToResults("hybrid");
        this.totalGames.hybrid++;
      }
      // Зараженный терран
      else {
        this.goToResults("infested");
        this.totalGames.infested++;
      }

      localStorage.setItem("sc2TotalGames", JSON.stringify(this.totalGames));
    },
  },
  computed: {
    totalScore() {
      let score = 0;
      for (let i in this.totalGames) {
        score += this.totalGames[i] * results[i].points;
      }
      return score;
    },
    openedRaces() {
      let count = 0;
      for (let i in this.totalGames) {
        if (this.totalGames[i] > 0) count++;
      }
      return count;
    },
    favoriteRace() {
      let max = "zerg";
      for (let i in this.totalGames) {
        if (this.totalGames[i] > this.totalGames[max]) {
          max = i;
        }
      }
      return results[max].name;
    },
    showResultRace() {
      return {
        zerg: this.totalGames.zerg > 0 ? true : false,
        primal: this.totalGames.primal > 0 ? true : false,
        protoss: this.totalGames.protoss > 0 ? true : false,
        taldarim: this.totalGames.taldarim > 0 ? true : false,
        terran: this.totalGames.terran > 0 ? true : false,
        infested: this.totalGames.infested > 0 ? true : false,
        hybrid: this.totalGames.hybrid > 0 ? true : false,
      };
    },
  },
});

let audio = new Audio("audio/soundtrack.mp3");
let audio_btn = document.querySelector(".btn__sound");
let audio_icon = document.querySelector(".btn__sound i");

audio.muted = true;
audio.volume = 0.2;

audio_btn.addEventListener("click", function () {
  if (audio.muted) {
    audio.play();
    audio.currentTime = 0 + Math.random() * (audio.duration + 1 - 0);

    audio_icon.classList.add("fa-volume-up");
    audio_icon.classList.remove("fa-volume-off");
  } else {
    audio_icon.classList.add("fa-volume-off");
    audio_icon.classList.remove("fa-volume-up");
  }
  audio.muted = !audio.muted;
});
