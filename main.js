var elements = document.querySelectorAll('.menu1 li a');

Array.from(elements).forEach((element) => {
  element.addEventListener('click', (event) => {
    update(event, 1);
  });
});

var elements = document.querySelectorAll('.menu2 li a');

Array.from(elements).forEach((element) => {
  element.addEventListener('click', (event) => {
    update(event, 2);
  });
});

var padding = {t: 40, r: 40, b: 40, l: 40};

var mapPopup = {};
weather['features'].forEach(city => {
    const key = city['properties']['key']
    mapPopup[key] = {'rain': undefined, 'avgTemp': undefined};
});

var maxTemp=0;
var minTemp=100000;

var mymap = L.map('mapid').setView([39.92702241199571, -96.37778509666124], 4);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(mymap);

L.geoJSON(weather, {
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            radius: getRadius(feature.properties.data, feature.properties.key),
            fillColor: getFillColor(feature.properties.data, feature.properties.key),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        });
    },
    onEachFeature: onEachFeature
}).addTo(mymap);

function onEachFeature(feature, layer) {
    layer.bindPopup('<h1>' + feature.properties.name + '</h1>' + '<p>Days of Rain (2014-15): ' + mapPopup[feature.properties.key].rain + '</p><p>Annual Average Temp: ' + Math.round(mapPopup[feature.properties.key].avgTemp) + '°F</p>', {closeButton: false});
}

function getRadius(data, key) {
    var area = 0;
    data.forEach(day => {
        if (day['actual_precipitation'] != 0) {
            area ++;
        }
    });
    mapPopup[key].rain = area;
    var radius = Math.sqrt(area/Math.PI);
    return radius * 2.8;
}

function getFillColor(data, key) {
    var totalTemp = 0;
    var days = 0;
    data.forEach(day => {
        days++;
        totalTemp = totalTemp + day['actual_mean_temp'];
    });
    var avgTemp = totalTemp/days;
    if (maxTemp < avgTemp) {maxTemp=avgTemp};
    if (minTemp > avgTemp) {minTemp=avgTemp};
    var myColor = d3.scaleLinear().domain([minTemp,maxTemp])
        .range(["blue", "red"]);
    mapPopup[key].avgTemp = avgTemp;
    return myColor(avgTemp);
}

var legendG = d3.select('#mapLegend').append('g');
legendG.append('text')
    .text('Number of Days where it rained (2014-2015)')
    .attr('x', (screen.width)*0.3/2-100)
    .attr('y', 20)
var circle1 = legendG.append('g');
circle1.attr('transform', "translate(" + ((screen.width)*0.3/2+40) + "," + padding.t + ")")
circle1.append('circle')
    .attr('r', Math.sqrt(25/Math.PI)*2.8)
circle1.append('text')
    .text('25')
    .attr('x', ((screen.width)*0.3/2-120))

var circle2 = legendG.append('g');
circle2.attr('transform', "translate(" + ((screen.width)*0.3/2+40) + "," + (padding.t*2 + Math.sqrt(25/Math.PI)*2.8) + ")")
circle2.append('circle')
    .attr('r', Math.sqrt(75/Math.PI)*2.8)
circle2.append('text')
    .text('75')
    .attr('x', ((screen.width)*0.3/2-120))

var circle3 = legendG.append('g');
circle3.attr('transform', "translate(" + ((screen.width)*0.3/2+40) + "," + (padding.t*3 + Math.sqrt(25/Math.PI)*2.8 + Math.sqrt(75/Math.PI)*2.8) + ")")
circle3.append('circle')
    .attr('r', Math.sqrt(125/Math.PI)*2.8)
circle3.append('text')
    .text('125')
    .attr('x', ((screen.width)*0.3/2-120))

var circle4 = legendG.append('g')
circle4.attr('transform', "translate(" + ((screen.width)*0.3/2+40) + "," + (padding.t*4 + Math.sqrt(25/Math.PI)*2.8 + Math.sqrt(75/Math.PI)*2.8 + Math.sqrt(125/Math.PI)*2.8) + ")")
circle4.append('circle')
    .attr('r', Math.sqrt(175/Math.PI)*2.8)
circle4.append('text')
    .text('175')
    .attr('x', ((screen.width)*0.3/2-120))

var colorLegend = legendG.append('g');
var defs = colorLegend.append("defs");

var gradient = defs.append("linearGradient")
    .attr("id", "svgGradient")
    .attr("x1", "100%")
    .attr("x2", "0%")
    .attr("y1", "0%")
    .attr("y2", "0%");

gradient.append("stop")
    .attr('class', 'start')
    .attr("offset", "0%")
    .attr("stop-color", "red")
    .attr("stop-opacity", 1);

gradient.append("stop")
    .attr('class', 'end')
    .attr("offset", "100%")
    .attr("stop-color", "blue")
    .attr("stop-opacity", 1);

colorLegend.attr('transform', "translate(" + ((screen.width)*0.3/2+40) + "," + (padding.t*4 + Math.sqrt(25/Math.PI)*2.8 + Math.sqrt(75/Math.PI)*2.8 + Math.sqrt(125/Math.PI)*2.8 + 80) + ")");
colorLegend.append('rect')
    .attr('x', -((screen.width)*0.3/2+40)/2)
    .attr('width', ((screen.width)*0.3/2+40))
    .attr('height', '30')
    .style('rx', '15')
    .attr('fill', 'url(#svgGradient)');

colorLegend.append('text')
    .text('Annual Average Temp (°F)')
    .attr('x', -80)
    .attr('y', -20)

colorLegend.append('text')
    .text(Math.round(minTemp) + '°F')
    .attr('x', -((screen.width)*0.3/2+40)/2-40)
    .attr('y', 20)

colorLegend.append('text')
    .text(Math.round(maxTemp) + '°F')
    .attr('x', ((screen.width)*0.3/2+40)/2+10)
    .attr('y', 20)

var margin = {top: 80, right: 30, bottom: 30, left: 60},
    width = screen.width - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

var svg = d3.select("#chart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

const startDate = new Date('2014-07-01');
const endDate = new Date('2015-06-30');

var x = d3.scaleTime()
    .domain([startDate, endDate])
    .range([ 0, width ]);
const xAxis = d3.axisBottom(x)
    .ticks(12)
    .tickFormat(d3.timeFormat("%B"));

svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

var y = d3.scaleLinear()
    .domain([0, 110])
    .range([ height, 0 ]);
svg.append("g")
    .call(d3.axisLeft(y))

svg.append("text")
    .attr("transform", "rotate(-90,-40,"+(height/2)+")")
    .attr("x", -30)
    .attr("y", height/2)
    .style("text-anchor", "middle")
    .text("Daily Mean Temperature (°F)")

var line = d3.line()
    .x((d,i)=> x(d.date)) 
    .y((d,i)=> y(d.temp))

var area = d3.area()
    .x((d,i) => x(d.date))
    .y0(function(d, i) { return y(d.temp+d.precip*14) })
    .y1(function(d, i) { return y(d.temp-d.precip*14) })

var legend = d3.select('#svgLegend')
    .append('g')
    .attr('transform', 'translate(10, 100)')

legend.append('text')
    .text('Daily Precipitation (inch)');

var item1 = legend.append('g')
    .attr('transform', 'translate(10, 10)')

item1.append('text')
    .text('0.10')
    .attr('y', 10)
    .attr('x',160);

item1.append('rect')
    .attr('width', 10)
    .attr('height', 0.1*260)
    .attr('y', 20)
    .attr('x', 160)
    .style('fill', '#F05039')
    .style('fill-opacity', '50%')

item1.append('text')
    .text('0.25')
    .attr('y', 10)
    .attr('x',120);

item1.append('rect')
    .attr('width', 10)
    .attr('height', 0.25*260)
    .attr('y', 20)
    .attr('x', 120)
    .style('fill', '#F05039')
    .style('fill-opacity', '50%')

item1.append('text')
    .text('0.5')
    .attr('y', 10)
    .attr('x',80);

item1.append('rect')
    .attr('width', 10)
    .attr('height', 0.5*260)
    .attr('y', 20)
    .attr('x', 80)
    .style('fill', '#F05039')
    .style('fill-opacity', '50%')

item1.append('text')
    .text('1.0')
    .attr('y', 10)
    .attr('x', 40);

item1.append('rect')
    .attr('width', 10)
    .attr('height', 1*260)
    .attr('y', 20)
    .attr('x', 40)
    .style('fill', '#F05039')
    .style('fill-opacity', '50%')

item1.append('text')
    .text('1.5')
    .attr('y', 10);

item1.append('rect')
    .attr('width', 10)
    .attr('height', 1.5*260)
    .attr('y', 20)
    .style('fill', '#F05039')
    .style('fill-opacity', '50%')

function update(event, num) {
    if (document.getElementsByClassName("line" + num).length !== 0) {
        const elements = document.getElementsByClassName("line" + num);
        elements[0].remove();
    }

    function colorPick(num) {
        if (num === 1) {
            return '#F05039';
        } else {
            return '#1F449C';
        }
    }
    
    document.querySelector('button.button' + num).innerText = event.target.innerText;
    var property = weather['features'][event.target.dataset.option]['properties'];

    var dateTemp = [];
    property['data'].forEach(day => {
        const parseTime = d3.timeParse("%Y-%m-%d");
        dateTemp.push({'date': parseTime(day.date), 'temp': day['actual_mean_temp'], 'precip': day['actual_precipitation']});
    });
    
    var line1 = svg.append('g')
        .attr('class', 'line'+num)

    line1.selectAll("path.area")
        .data([dateTemp])
        .join('path')
        .attr('class', 'area')
        .attr("fill", colorPick(num))
        .attr("fill-opacity", "50%")
        .attr("stroke", "none")
        .attr("d",function(d, i) { 
            return area(d) 
        })

    line1.selectAll("path.line")
        .data([dateTemp])
        .join("path")
        .attr('class', 'line')
        .attr("d", function(d, i) { 
            return line(d) 
        })
        .style("stroke", colorPick(num))
        .style("stroke-width", 2) 
        .style("fill", "none")

    line1.append('text')
        .text(event.target.innerText)
        .attr('x', width/2)
        .attr('y', () => { 
            if (num === 1) {
                return margin.top
            } else {
                return margin.top + 20
            } })
        .attr('fill', colorPick(num))
}