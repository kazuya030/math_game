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
        ans.push({source: {x:dir*(r+5), y:0}, target: {x:dir*(110-2*r), y:(j-(i%N))*50}, width: (N-map_pref[name].indexOf(name_target))*2});
    }
    return ans;
}

function getLinePath(map_applying){
    var j, name_m, name_f;
    var data_path = [];

    for(name_f in map_applying){
        for (j=0;j<map_applying[name_f].length;j++){
            name_m = map_applying[name_f][j];
            data_path.push({source:{x:105+r, y:male.indexOf(name_m)*50+50}, target: {x:195-r, y:female.indexOf(name_f)*50+50}})

        }
    }
    return data_path;
}

function drawRejected(){
    var i;
    for (i=0;i<N;i++){
        if (male_rejected.indexOf(male[i]) == -1) {
            d3.select('#' + male[i] + ' circle').attr('class', '');
        }else{
            d3.select('#' + male[i] + ' circle').attr('class', 'rejected');
        }
    }
}

function reset(){
    step = 0;
    map_pref = {};
    map_reject = {};
    map_applying = {};
    isApply=false;

    for (i=0;i<N;i++){
        map_pref[male[i]] = shuffle(female.slice());
        map_pref[female[i]] = shuffle(male.slice());

        // 男性は reject をカウントする
        map_reject[male[i]] = 0;
        // 女性はrejectをカウントする必要なし
        /* map_reject[female[i]] = 0;*/

        // 女性は apply を stock する
        map_applying[female[i]] = [];

    }
    male_rejected = male.slice();

    //  参加者の dataset  を生成
    dataset = [];
    for (i=0;i<N;i++){
        dataset.push({name: male[i], sex:'male', charm: r});
    }
    for (i=0;i<N;i++){
        dataset.push({name: female[i], sex:'female', charm: r});
    }
    d3.select('#step').attr('disabled', null);

    d3.select('#label_step').node().innerHTML = 'before Start';
    if(g_apply) {
        g_apply.selectAll('path').data([]).exit().remove();
    }
    d3.selectAll('.num-pref').text('');

}

function addStep(){
    var i, j, name_m, name_f, l_applying, l_rank, rank_top, name_top, rank_m, rank_f;
    if(isApply){
        male_rejected = [];
        for(i=0;i<N;i++){
            name_f = female[i];
            l_applying = map_applying[name_f];
            if(l_applying.length > 1){
                l_rank = [];
                // なぜか map で書けない
                // map_applying[name_f].map( map_pref[name_f].indexOf )
                for(j=0;j<l_applying.length;j++){
                    l_rank.push(map_pref[name_f].indexOf(l_applying[j]));
                }
                rank_top=Math.min.apply(null, l_rank);
                name_top=map_pref[name_f][rank_top];
                for(j=0;j<l_applying.length;j++){
                    if(l_applying[j] !== name_top){
                        male_rejected.push(l_applying[j]);
                    }
                }
                map_applying[name_f] = [name_top];
            }
        }
        isApply = false;
        if(male_rejected.length==0) {
            d3.select('#step').attr('disabled', true);
            d3.select('#label_step').node().innerHTML = 'step ' + step + ' : Complete';

            for(name_f in map_applying){
                name_m = map_applying[name_f][0];
                rank_m = map_pref[name_m].indexOf(name_f)+1;
                rank_f = map_pref[name_f].indexOf(name_m)+1;
                d3.select('#' + name_m + ' .num-pref').text(rank_m);
                d3.select('#' + name_f + ' .num-pref').text(rank_f);

            }

            return;
        }

    } else {
        step++;

        for(i=0;i<male_rejected.length;i++){
            name_m = male_rejected[i];
            name_f = map_pref[name_m][ map_reject[name_m]++ ];
            map_applying[name_f].push(name_m);
        }
        male_rejected = [];
        isApply = true;
    }
    g_apply.selectAll('path').data([]).exit().remove();
    g_apply.selectAll('path').data(getLinePath(map_applying)).enter().append('path')
        .attr('class', 'line-apply')
        .attr('d',diagonal);
    drawRejected();
    d3.select('#label_step').node().innerHTML = 'step ' + step + ' : phase ' + (isApply ? 'apply' : 'reject');

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
var step;
var isApply;
var N = 5; //参加者の数

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height)
    .append('g');
var diagonal = d3.svg.diagonal();


var male = ['Adam', 'Bill', 'Charles', 'Dick' , 'Edgar'];
var female = ['Jane', 'Kate', 'Linda', 'Mary',  'Natalie'];

var map_pref, map_reject, map_applying; // map
var male_rejected, dataset; //list
reset();


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
var g_apply = svg.append('g').attr('class', 'apply');

drawRejected();

d3.select('#step').on('click', addStep);
d3.select('#reset').on('click', reset);