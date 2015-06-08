// ************************************************************************** //
//                                                                            //
//                                                        :::      ::::::::   //
//   computor.js                                        :+:      :+:    :+:   //
//                                                    +:+ +:+         +:+     //
//   By: roblabla </var/spool/mail/roblabla>        +#+  +:+       +#+        //
//                                                +#+#+#+#+#+   +#+           //
//   Created: 2015/03/26 16:42:28 by roblabla          #+#    #+#             //
//   Updated: 2015/06/08 15:27:22 by roblabla         ###   ########.fr       //
//                                                                            //
// ************************************************************************** //

require('array.prototype.find');
require('array.prototype.findindex');

if (process.argv.length < 3)
{
  console.log("Usage: ./computor \"<pol> = <pol>\"");
  process.exit(0);
}

var formula = process.argv.slice(2).join("").toUpperCase().split(" ").join("").split("=");
if (formula.length !== 2)
{
  console.log("Usage: ./computor \"<pol> = <pol>\"");
  process.exit(0);
}

var i = 0;
var polynomialL = [];
var polynomialR = [];
var currPol = polynomialL;

var callMember = function(member, args) {
  return function(item) {
    return item[member].apply(item, args);
  }
}

var concat = function(a, b) {
  return a.concat(b);
}

// [[num, index]] without order.
function parseSide(pol) {
  return pol.split("-")
            .map(function(elem, index) {
              return (index > 0 ? "-" : "") + elem
            })
            .filter(function (elem) {
              return (elem != "");
            })
            .map(callMember("split", ["+"]))
            .reduce(concat, [])
            .map(callMember("split", ["X"]))
            .map(function(elem) {
              if (elem.length === 1)
                elem = [parseFloat(elem), 0];
              else if (elem.length === 2)
              {
                elem[0] = elem[0] == "-" ? "-1" : elem[0];
                elem[0] = elem[0] == "" ? 1 : parseFloat(elem[0]);
                elem[1] = elem[1] == "" ? 1 : parseInt(elem[1].substr(1));
              }
              return elem;
            })
}

function simplify(pol) {
  return pol.reduce(function(prev, curr) { //[[curr, index]] => [cur] (index-ordered)
        if (prev[curr[1]] == null)
          prev[curr[1]] = curr[0];
        else
          prev[curr[1]] += curr[0];
        return prev;
        }, [])
     .map(function(item, index) {
       return [item, index];
     })
     .reduce(function(prev, curr) {
       if (Array.isArray(curr))
         prev.push(curr);
       return prev;
     }, []);
}
var polL = simplify(parseSide(formula[0]));
var polR = simplify(parseSide(formula[1]));

polR.forEach(function (val) {
  if (val[0] === 0)
    return;
  var pos = polL.findIndex(function(item) {
    return item[1] === val[1];
  });
  if (pos < 0)
    polL.push([-val[0],val[1]]);
  else
    polL[pos][0] -= val[0];
});

polL = polL.filter(function (x) {
  return (x[0] !== 0);
});

function stringify(pol)
{
  if (polL.length == 0)
    return "0 * X^0";
  var str = pol[0][0] + " * X^" + pol[0][1];
  pol.forEach(function(val, index) {
    if (index == 0)
      return;
    str += val[0] < 0 ? " - " : " + ";
    str += val[0] < 0 ? -val[0] : val[0];
    str += " * X^";
    str += val[1];
  });
  return str;
}

console.log("Reduced form:", stringify(polL), "= 0");

function quickmax(prev, curr) {
  if (curr[1] > prev)
    return curr[1];
  else
    return prev;
}

var max = polL.reduce(quickmax, 0);
console.log("Polynomial degree:", max);

if (max > 2)
{
  console.log("The polynomial degree is strictly greater than", max, ", I can't solve");
  process.exit(0);
}
var a = polL.find(function(x) { return x[1] == 2; });
var b = polL.find(function(x) { return x[1] == 1; });
var c = polL.find(function(x) { return x[1] == 0; });
a = a ? a[0] : 0;
b = b ? b[0] : 0;
c = c ? c[0] : 0;
if (max === 0)
{
  if (polL.length != 0)
    console.log("There are no solutions");
  else
    console.log("Every real is a solution");
}
if (max === 1)
{
  console.log("The solution is:");
  console.log(b / c);
}
if (max === 2)
{
  // Calculate delta
  var delta = b * b - 4 * a * c;
  console.log("Discriminent is :", delta);
  if (delta > 0)
  {
    console.log("Discriminent is strictly positive, the two solutions are:");
    console.log(((-b - mysqrt(delta)) / (2*a)).toFixed(6));
    console.log(((-b + mysqrt(delta)) / (2*a)).toFixed(6));
  }
  else if (delta === 0)
  {
    console.log("Discriminent is zero, the solution is :");
    console.log(-b / (2*a));
  }
  else
  {
    console.log("Discriminent is strictly negative, the two solutions are:");
    console.log((-b / (2*a)).toFixed(6) + " + i * " + (mysqrt(-delta) / (2*a)).toFixed(6));
    console.log((-b / (2*a)).toFixed(6) + " - i * " + (mysqrt(-delta) / (2*a)).toFixed(6));
  }
}

function abs(a)
{
  if (a < 0)
    return (-a);
  else
    return (a);
}

function mysqrt(a)
{
  var epsilon = 0.000001;
  var guess = a / 2;
  while (abs(guess * guess - a) > epsilon)
  {
    var r = a / guess;
    guess = (guess + r) / 2;
  }
  return guess;
}
