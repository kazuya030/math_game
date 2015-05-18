function shuffle(arr) {
    var i, j, temp;
    arr = arr.slice();
    i = arr.length;
    if (i === 0) {
        return arr;
    }
    while (--i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    return arr;
}

function getLinePref(name, sex, i){
    var j;
    var dir = (sex=='male')?1:-1;
    var ans = [];
    for(j=0;j<N;j++){
        name_target = (sex=='male')?female[j]:male[j];
        ans.push({source: {x:dir*(r+5), y:0}, target: {x:dir*(95-r), y:(j-(i%N))*50}, width: (N-map_pref[name].indexOf(name_target))*2});
    }
    return ans;
}

function onHover(){
    var target, rank;
    var id = this.parentNode.id;
    d3.select('#'+id).selectAll('path').attr('visibility', 'visible');
    for(target in map_pref){
        rank = map_pref[target].indexOf(id)+1;
        if (rank>0) {
            d3.select('#' + target + ' .num-pref').text(rank);
        }
    }
}
function outHover(){
    var id = this.parentNode.id;
    d3.select('#'+id).selectAll('path').attr('visibility', 'hidden');
    d3.selectAll('.num-pref').text('');
}

var width = 300;
var height = 300;
var r=15;
var i;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g');
//    .attr('transform','translate(200,200)');

var diagonal = d3.svg.diagonal();


var N = 5;//参加者の数

var male = ['Adam', 'Bill', 'Charles', 'Dick' , 'Edgar'];
var female = ['Jane', 'Kate', 'Linda', 'Mary',  'Natalie'];

var map_pref = {};
for (i=0;i<N;i++){
    map_pref[male[i]] = shuffle(female.slice());
    map_pref[female[i]] = shuffle(male.slice());
}

//  参加者の dataset  を生成
var dataset = [];
for (i=0;i<N;i++){
    dataset.push({name: male[i], sex:'male', charm: r});
}
for (i=0;i<N;i++){
    dataset.push({name: female[i], sex:'female', charm: r});
}


var g = svg.selectAll('g').data(dataset).enter().append('g')
    .attr({
        // 座標設定を動的に行う
        transform: function(d, i) {
            return 'translate(' + (d.sex==='male' ? 100 : 200) + ',' + ((i%N)*50+50) + ')';
        }
    })
    .attr('id', function(d){ return d.name; })
    .attr('class', function(d){ return d.sex; });


g.append('circle')
    .attr('r', function(d) { return d.charm; })
    .on('mouseover', onHover)
    .on('click', onHover)
    .on('mouseout', outHover);

g.append('text')
    .attr('x', function(d){ return (d.sex=='male')?(-90):(r+5);})
    .attr('dy', ".35em")
    .text(function(d){ return d.name; });



g.selectAll('path').data(function(d, i){ return getLinePref(d.name, d.sex, i) }).enter().append('path')
    .attr('class', 'line-pref')
    .attr('stroke-width', function(d){ return d.width})
    .attr('d',diagonal)
    .attr('visibility', 'hidden');

g.append('text')
    .attr('class', 'num-pref')
    .attr('dy', ".35em")
    .text('');

