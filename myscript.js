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

function getCoord(name){
    var trans = d3.transform(d3.select('#'+name).attr('transform'));
    return {x: trans.translate[0], y: trans.translate[1]}
}

function getLinePref(name){
    var i;
    var source_val = getCoord(name);
    var ans = [];
    for(i=0;i<N;i++){
        ans.push({source: source_val, target: getCoord(map_pref[name][i]), width: (N-i)*2});
    }
    return ans;
}


var width = 300;
var height = 300;
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
    dataset.push({name: male[i], sex:'male', charm: 1});
}
for (i=0;i<N;i++){
    dataset.push({name: female[i], sex:'female', charm: 1});
}


var g = svg.selectAll('g').data(dataset).enter().append('g')
        .attr({
            // 座標設定を動的に行う
            transform: function(d, i) {
                return 'translate(' + (d.sex==='male' ? 50 : 200) + ',' + ((i%N)*50+50) + ')';
            }
        })
        .attr('id', function(d){ return d.name; });


function showLinePref(d){
    svg.selectAll('path').data(getLinePref(d.name)).enter()
        .append('g')
        .attr('class', d.sex)
        .append('path')
        .attr('class', 'line-pref')
        .attr('stroke-width', function(d){return d.width})
        .attr('d',diagonal);
}

g.append('circle')
    .attr('r', function(d) {
        return d.charm*10;
    })
    .attr('class', function(d){
        return d.sex;
    })
    .on('mouseover', showLinePref)
    .on('click', showLinePref)
    .on('mouseout', function(){
        svg.selectAll('.line-pref').data([]).exit().remove()
    });

g.append('text')
    .attr('x', 15)
    .attr('dy', ".35em")
    .text(function(d){ return d.name; });







