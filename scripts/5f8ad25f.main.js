!function(){var a=angular.module("mainApp",["ui.router","ui.bootstrap","ui.keypress","ui.event","ngSanitize","firebase","ngAnimate","angularLocalStorage","md5","ui-gravatar","angular-growl"]);"127.0.0.1"==window.location.hostname?a.constant("ENV","development").constant("FBURL","https://dekkusu.firebaseio.com/").constant("DEBUG",!0).constant("SITE",{title:"Dekkusu - Dev",company:"J. Harshbarger",year:"2013"}):a.constant("ENV","production").constant("FBURL","https://dekkusu-prod.firebaseio.com/").constant("DEBUG",!1).constant("SITE",{title:"Dekkusu",company:"J. Harshbarger",year:"2013"}),a.config(["$logProvider","DEBUG",function(a,b){a.debugEnabled(b)}]),a.config(["growlProvider",function(a){a.globalTimeToLive(5e3)}])}();var DEBUG=!1,SECONDS=1e3,MINS=60*SECONDS,HOURS=60*MINS,DAYS=24*HOURS;angular.module("mainApp").controller("DeckListCtrl",["$scope","$location","$http","$stateParams","$rootScope",function(a,b,c,d){console.log(d)}]),angular.module("mainApp").controller("DeckCtrl2",["$scope","$http",function(){}]),angular.module("mainApp").controller("DeckCtrl",["$state","$scope","$location","$http","$stateParams","$rootScope","statusFilterFilter","$firebase","FBURL","deckManager",function(a,b,c,d,e,f,g,h,i,j){function k(){var a=b.cardIds=b.cards.$getIndex();b.stats={"new":0,due:0,done:0,total:a.length}}b.username=e.username||"default",f.deckId=b.deckId=e.deck||0,b.decks=[],b.search=c.search(),b.filter=STATUSALL,b.isEditing=!1,b.decks=j.getUserDeckIds(b.username),b.cards=j.getCardsByDeckId(b.deckId),b.cards.$on("loaded",k),b.cards.$on("change",k),b.add=function(a){a.due=new Date+5*MINS,b.cards.$add(a),a.text=""}}]),angular.module("mainApp").filter("formatCard",["$sanitize",function(a){var b=function(){return[{type:"lang",regex:"(\\S*)\\{\\[(.*?)\\]\\}",replace:"$1[{$2}]"},{type:"lang",regex:"(\\S*)\\[(.*?)\\]",replace:"<ruby><rb>$1</rb><rp>&#91;</rp><rt>$2</rt><rp>&#93;</rp></ruby>"}]},c=function(){return[{type:"lang",regex:"{{(.*?)::(.*?)}}",replace:'&#91;{$1}<span class="uncloze">$2</span>&#93;'},{type:"lang",regex:"{(.*?)::(.*?)}",replace:'{$1}<span class="uncloze">$2</span>'},{type:"lang",regex:"{{(.*?)}}",replace:'&#91;{$1}<span class="uncloze">...</span>&#93;'},{type:"lang",regex:"{(.*?)}",replace:'<span class="cloze">$1</span>'}]},d=function(){return[{type:"lang",regex:"\n{1,}",replace:"\n\n"}]},e=new Showdown.converter({extensions:[d,b,c]});return function(b){return a(e.makeHtml(b||""))}}]),angular.module("mainApp").filter("firstDueIndex",function(){return function(a){var b=void 0;if(a)for(var c in a)(void 0==b||a[c].due<a[b].due)&&(b=c);return+b}}),angular.module("mainApp").filter("dueNow",function(){return function(a){var b=Date.now();return a.filter(function(a){return a.due<b})}}),angular.module("mainApp").filter("dateDays",function(){var a=Date.now();return function(b){if(!b)return"now";var c=b-a;return 0>c||!c?"now":(c=c/1e3/60,1>c?"soon":(c=c/60/24,1>c?"today":Math.floor(c)+" days"))}}),angular.module("mainApp").filter("markdown",[function(){var a=new Showdown.converter;return function(b){return a.makeHtml(b||"")}}]);var STATUSALL=-1,STATUSNEW=0,STATUSDUE=1,STATUSDONE=2;angular.module("mainApp").filter("status",[function(){var a=Date.now();return function(b){return b?null==b.last?STATUSNEW:b.due<=a?STATUSDUE:STATUSDONE:-1}}]),angular.module("mainApp").filter("statusText",[function(){return function(a){return a==STATUSNEW?"New":a==STATUSDUE?"Due":"Not due"}}]),angular.module("mainApp").filter("statusFilter",["$filter",function(a){var b=a("status");return function(a,c){return-1==c?a:a.filter(function(a){return b(a)==c})}}]),function(){angular.module("mainApp").config(["$stateProvider","$urlRouterProvider",function(a,b){b.otherwise("/"),b.rule(function(a,b){var c,d=b.path(),e=b.search();if("/"===d[d.length-1])return 0===Object.keys(e).length?d.slice(0,d.length-1):(c=[],angular.forEach(e,function(a,b){c.push(b+"="+a)}),d+"?"+c.join("&"))});var c=["userManager",function(a){return a.auth()}],d=["userManager",function(a){return a.getUsers()}],e=["$stateParams","userManager",function(a,b){return b.getUserData(a.username)}],f=["$stateParams","deckManager",function(a,b){return b.getDeck(a.username)}],g=["$stateParams","deckManager",function(a,b){return b.getDeck(a.username,a.deck)}];a.state("authroot",{"abstract":!0,controller:"HomeCtrl",resolve:{userAuth:c},templateUrl:"components/home/rootView.html"}).state("authroot.home",{url:"/",templateUrl:"components/home/homeView.html"}).state("authroot.readme",{url:"/readme",templateUrl:"components/home/README.html"}).state("authroot.list",{url:"/users",controller:"ListCtrl",templateUrl:"components/users/listView.html",resolve:{users:d}}).state("authroot.user",{"abstract":!0,url:"/:username",templateUrl:"components/users/userView.html",controller:"userViewCtrl",resolve:{rootDeck:f,user:e}}).state("authroot.user.deckList",{url:"",templateUrl:"components/decks/deckList.html",controller:"userDeckListCtrl",resolve:{deck:f}}).state("authroot.user.deck",{url:"/:deck",templateUrl:"components/decks/deckList.html",controller:"userDeckListCtrl",resolve:{deck:g}})}]),angular.module("mainApp").run(["$rootScope","SITE","growl","$log",function(a,b,c){a.site=b,a.$on("$stateChangeError",function(){c.addErrorMessage("State change error")}),a.$on("$stateNotFound",function(a,b,d,e){c.addSuccessMessage("State not found error"),$log.error(b,d,e)})}])}(),function(){"use strict";angular.module("mainApp").factory("gravatarImageService",function(a){return{getImageSrc:function(b,c,d,e,f){var g=a.createHash(b.toLowerCase()),h=(f?"https://secure":"http://www")+".gravatar.com/avatar/"+g;return c&&(h+="?s="+c),d&&(h+="&r="+d),e&&(h+="&d="+e),h}}}),angular.module("mainApp").service("userManager",["$log","$q","$location","$rootScope","FBURL","$firebase","$firebaseSimpleLogin","gravatarImageService","md5","growl",function(a,b,c,d,e,f,g,h,i,j){var k=this,l=new Firebase(e),m=l.child("users");this.auth=function(){function a(){c.resolve(e)}var c=b.defer(),e=g(l);return d.$on("$firebaseSimpleLogin:login",a),d.$on("$firebaseSimpleLogin:logout",a),d.$on("$firebaseSimpleLogin:error",a),c.promise},this.getUsers=function(){var a=l.child("users");return f(a)},this.getUserData=function(a){var b=m.child(a);return f(b)},d.$on("$firebaseSimpleLogin:login",function(a,b){j.addSuccessMessage("Logged in as "+(b.username||b.id));var c=k.getUserData(b.username||b.id);c.$on("loaded",function(){c=c||{},c.gravatar_id=i.createHash((b.email||b.uid).toLowerCase()),c.$save(),d.$broadcast("userAuth:data_loaded",c)}),d.userData=c}),d.$on("$firebaseSimpleLogin:logout",function(){j.addWarnMessage("Logged out","warning"),d.userData={},c.path("/")}),d.$on("$firebaseSimpleLogin:error",function(b,c){a.error(c),j.addErrorMessage("Error logging in")})}])}(),angular.module("mainApp").service("deckManager",["FBURL","$firebase","$rootScope",function(a,b){var c=this,d=new Firebase(a),e=d.child("decks");this.getDeck=function(a,d){var d=d||"root",f=e.child(a+"/"+d),g=b(f);return g.$children=c.getChildren(a,d),g},this.getChildren=function(a,c){var c=c||"root",d=e.child(a),f=d.child(c+"/children"),g=Firebase.util.intersection({ref:f,keyMap:{".value":"name2"}},{ref:d,keyMap:["name"]});return b(g)}}]),function(){"use strict";angular.module("mainApp").controller("HomeCtrl",["$rootScope","userAuth",function(a,b){a.auth=b}])}(),angular.module("mainApp").controller("userViewCtrl",["$scope","$rootScope","$state","$stateParams","rootDeck","user","storage",function(a,b,c,d,e,f,g){a.user=f,a.username=d.username||"guest",a.rootDeck=e,a.decks=e.$children,g.bind(a,"listView",{defaultValue:!1}),g.bind(a,"editView",{defaultValue:!1}),b.state=c,a.$watch("auth.user",function(b){return b?(a.isOwner=b.username==f.$id||b.id==f.$id,void 0):a.isOwner=!1})}]),angular.module("mainApp").controller("userDeckListCtrl",["$scope","$stateParams","deck",function(a,b,c){a.deckId=b.deck||"",a.deck=c,c.$bind(a,"deck"),a.children=c.$children,a.newdeck={name:""},a.save=function(b){b==a.deckId?c.$save():c.$children.$save(b)},a.addDeck=function(a){a.name2=a.name,c.$children.$add(a),a.name=""},a.removeDeck=function(a){c.$children.$remove(a)},a.drop=function(b,c,d,e){console.log("drop",d,e,a.children)},a.dropped=[]}]),angular.module("mainApp").controller("deckCardCtrl",["$scope",function(a){a.editCard=!1,a.clozed=!0,a.isClozed=function(a){return a&&0!=a.length?a.indexOf("{")>-1:!1},a.edit=function(b){a.editCard=!a.editCard,a.editCard||a.save(b)}}]),angular.module("mainApp").directive("fittext",function(){return{scope:{minFontSize:"@",maxFontSize:"@",text:"="},restrict:"C",transclude:!0,template:'<div ng-transclude class="textContainer" ng-bind-html="text" style="border: 1px solid red; display: inline-block;"></div>',controller:function(a,b){var c,d,e=a.maxFontSize||50,f=a.minFontSize||14,g=b[0].querySelector(".textContainer"),h=b[0].offsetHeight,i=b[0].offsetWidth,j=function(){do{g.style.fontSize=e+"px",c=g.offsetHeight,d=g.offsetWidth,console.log(d),Math.floor(c/h),Math.floor(d/i);var a=1;e-=a}while(d>i&&e>f)};a.$watch("text",function(b,c){void 0!==b&&(void 0!==c&&b.length<c.length&&(e=a.maxFontSize),j())})}}}),function(){"use strict";angular.module("mainApp").controller("ListCtrl",["$scope","users",function(a,b){console.log(b),a.users=b}])}();