//
// TODO: implement the logic to decide whether or not to make a trade
//
function decideWhetherOrNotToTrade(tweet, tprice, currency){
	//consolo.log("tweet: ", tweet)
	var list=["game", "news", "fun", "money", "good", "actor", "movies", "tech", "music", "people", "apple"]
	var groups= {
    "game": 1031,
    "news": 1028,
    "fun": 1029,
    "money":1031,
    "good":1029,
    "actor":1027,
    "movies":1036,
    "tech":1011,
    "music":1030,
    "people":1031,
    "apple":1035
}

	var price;
	var num=0;
	_.forEach(list, function(l){
		if(_.include(tweet["tweet"], l)){
			num=num+1
			price=price+groups[l]
		}
	})
	price=price/num
	console.log("tweet:", tprice)
	if(currency == 'USD'){
		return price > tprice
	}
	else
		return price < tprice

}
