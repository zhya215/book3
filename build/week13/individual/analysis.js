function analyze(){

  //
  // Getting To Know the Data
  //

  heading('Examples')

  ask('how many measurements were included in this dataset?', example1)

  ask('how many samples does each measurement contain?', example2)

  ask('at the 10-th measurement, what are valid sample values (> 0)?', example3)
  // a sample value is valid if it is greater than zero

  heading('Measurements and Samples')

  ask('how many unique non-zero, non-negative sample values in this dataset? what are they?', func1)

  ask('what is the average time (seconds) between two measurements?', func2)

  ask('at 09:57:18, how many samples in this measurement have the value 7?', func3)

  ask('which measurement has the most number of samples with the value 3?', func4)

  ask('how many measurements have no sample value greater than zero?', func5)

  ask('which valid (i.e., greater than zero) sample value is the most common?', func6)

  heading('Mapping')

  ask('when was the boat furthest away from NYC (40.7127 N, 74.0059 W)? what was the distance?', func7)
  // use Leaflet to draw a line between NYC and this "furtherest away" location

  ask('what was the path of the boat?', func8)
  // use Leaflet to draw a line between every two locations

  ask('where were the most common sample value measured?', func9)
  // say, your answer to Question Six is 13, draw a marker for each measurement that has
  // at least one sample whose value is 13

  ask('how does the desensity of valid sample values change across the geographical area?', func10)
  // use the brightness to indicate high number of valid sample values each
  // for each measurement, draw a marker,
  // use the brightness to represent the number of valid samples
  // the brighter a spot, the higher the number
  // for those measurements without a valid sample, draw nothing

  heading('Science')

  ask('what is the distribution of fish?', func11)

  ask('what is the distribution of  are schools of zooplankton?', func12)


  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  })
  toggleSourecode()
}

function example1(){
  return items.length
}

function example2(){
  return items[0].Samples.length
}

function example3(){
  return _.filter(items[9].Samples, function(d){
    return d > 0
  }).join(', ')
}

function func1(){
  var samples=_.map(items, function(i){
    return _.uniq(_.filter(i.Samples, function(s){
      return s>0
    }))
  })
  var flat= _.flatten(samples)
  var unique=_.uniq(flat)
  console.log("items: ", items)
  return unique
}

function func2(){

  var date_time=_.map(items, function(i){
    var d=new Date(i["Ping_date"]+"T"+i["Ping_time"])
    return d.getTime()/1000
  })
  console.log("time: ", date_time)
  var size=date_time.length
  var date_map=_.map(date_time, function(d, i){
    if(i == size-1)
      return 0
    return date_time[i+1]-d
  })
  console.log("map: ", date_map)
  return _.sum(date_map)/(date_map.length-1)
}

function func3(){
  var group=_.filter(items, function(i){
    return i["Ping_time"] === "09:57:18"
  })
  console.log("group: ", group)
  var samples=group[0].Samples
  var filt=_.filter(samples, function(s){
    return parseInt(s) == 7
  })
  console.log("samples: ", samples)
  return filt.length
}

function func4(){
  var groups=_.map(items, function(i){
    var samples=i.Samples
    return {
      index: parseInt(i.Ping_index)-1,
      length:  _.filter(samples, function(s){
        return parseInt(s) == 3
      }).length
    }
  })
  var max=_.max(groups, function(g){
    return g.length
  })
  console.log(groups[max.index])
  return items[max.index].Ping_time
}

function func5(){
  var map=_.map(items, function(i){
    return _.filter(i.Samples, function(s){
      return s > 0
    }).length
  })
  return _.filter(map, function(m){
    return m == 0
  }).length
}

function func6(){
  var samples=_.map(items, function(i){
    return _.uniq(_.filter(i.Samples, function(s){
      return s>0
    }))
  })
  var flat= _.flatten(samples)
  var map_flat=_.map(flat, function(f){
    return {
      value: f
    }
  })
  var groups=_.groupBy(map_flat, function(m){
    return m.value
  })
  var map_value=_.mapValues(groups, function(g){
    return g.length
  })
  console.log("groups: ", groups)
  var pairs=_.pairs(map_value)
  var max= _.max(pairs, function(p){
    return p[1]
  })
  return max[0]
}

function func7(){

  // this sample code shows how to display a map and put a marker to visualize
  // the location of the first item (i.e., measurement data)
  // you need to adapt this code to answer the question

  var first = items[0]
  var pos = [first.Latitude, first.Longitude]
  var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
  $(el).height(500) // set the map to the desired height
  
  var NYC_pos=[40.7127, 74.0059]
  var distances=_.map(items, function(i){
    return {
      position: [i.Latitude, i.Longitude],
      distance: (NYC_pos[0]-i.Latitude)*(NYC_pos[0]-i.Latitude)+(NYC_pos[1]-i.Longitude)*(NYC_pos[1]-i.Longitude)
    }
  })
  var max_dist=_.max(distances, function(d){
    return d.distance
  })
  var map = createMap(el, max_dist.position, 5)
  var circle = L.circle(max_dist.position, 500, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5
  }).addTo(map);
  return max_dist.position
}

function func8(){
  var first = items[0]
  var pos = [first.Latitude, first.Longitude]
  var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
  $(el).height(500) // set the map to the desired height
  var map = createMap(el, pos, 10)
  _.forEach(items, function(i){
    L.circle([i.Latitude, i.Longitude], 500, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5
    }).addTo(map);
  })
  
  return '...'
}

function func9(){
  var groups=_.map(items, function(i){
    var samples=i.Samples
    return {
      index: parseInt(i.Ping_index)-1,
      length:  _.filter(samples, function(s){
        return parseInt(s) == 3
      }).length
    }
  })
  var max=_.max(groups, function(g){
    return g.length
  })
  console.log(groups[max.index])
  var pos=[items[max.index].Latitude, items[max.index].Longitude]

  var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
  $(el).height(500) // set the map to the desired height
  var map = createMap(el, pos, 5)

  var circle = L.circle(pos, 500, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5
  }).addTo(map);
  
  return pos
}

function func10(){
  var first = items[0]
  var pos = [first.Latitude, first.Longitude]
  var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
  $(el).height(500) // set the map to the desired height
  var map = createMap(el, pos, 15)
  _.forEach(items, function(i){
    var size=_.filter(i.Samples, function(e){
      return e > 0
    }).length
    L.circle([i.Latitude, i.Longitude], size*0.5, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5
    }).addTo(map);
  })
  return '...'
}

function func11(){
  var fish_map=_.map(items, function(i){
    return {
      depth: i.Depth_stop,
      position: [i.Latitude, i.Longitude],
      fishes: _.filter(i.Samples, function(s){
        return parseInt(s) == 1 || parseInt(s) == 3
      }).length
    }
  })
  console.log("map", fish_map)
  var first = items[0]
  var pos = [first.Latitude, first.Longitude]
  var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
  $(el).height(500) // set the map to the desired height
  var map = createMap(el, pos, 12)
  _.forEach(fish_map, function(i){
    L.circle(i.position, i.fishes*10, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5
    }).addTo(map);
  })
  return "map"
}

function func12(){
  var zoo_map=_.map(items, function(i){
    return {
      depth: i.Depth_stop,
      position: [i.Latitude, i.Longitude],
      zoo: _.filter(i.Samples, function(s){
        return parseInt(s) == 7 || parseInt(s) == 13
      }).length
    }
  })
  console.log("map", zoo_map)
  var first = items[0]
  var pos = [first.Latitude, first.Longitude]
  var el = $(this).find('.viz')[0]    // lookup the element that will hold the map
  $(el).height(500) // set the map to the desired height
  var map = createMap(el, pos, 13)
  _.forEach(zoo_map, function(i){
    L.circle(i.position, i.zoo*10, {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5
    }).addTo(map);
  })
  return "map"

}
